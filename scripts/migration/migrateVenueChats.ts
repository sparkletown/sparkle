#!/usr/bin/env node -r esm -r ts-node/register

import { chunk, difference, groupBy, range } from "lodash";

import {
  checkFileExists,
  initFirebaseAdminApp,
  makeScriptUsage,
  parseCredentialFile,
} from "../lib/helpers";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
} from "../lib/types";

const usage = makeScriptUsage({
  description:
    "Migrate venue chats data after worlds refactoring. " +
    "If no venueId is provided script will execute over all venues",
  usageParams: "CREDENTIAL_PATH venueId",
  exampleParams: "fooAccountKey.json mypartymap",
});

const [credentialPath, venueId] = process.argv.slice(2);
if (!credentialPath) {
  usage();
}

if (!checkFileExists(credentialPath)) {
  console.error("Credential file path does not exists:", credentialPath);
  process.exit(1);
}

const { project_id: projectId } = parseCredentialFile(credentialPath);

if (!projectId) {
  console.error("Credential file has no project_id:", credentialPath);
  process.exit(1);
}

const BATCH_MAX_OPS = 500;
const VENUE_CHAT_MESSAGES_COUNTER_SHARDS_COUNT = 10;
const app = initFirebaseAdminApp(projectId, { credentialPath });

const updateChatMessagesCounter = async (venueRef: DocumentReference) => {
  const batch = app.firestore().batch();
  const counterCollectionRef = venueRef.collection("chatMessagesCounter");
  const messagesRef = await venueRef.collection("chats").listDocuments();
  const allShards = await counterCollectionRef.listDocuments();
  console.log(`\tUpdating chatMessagesCounter to ${messagesRef.length}...`);
  for (
    let shardId = 0;
    shardId < VENUE_CHAT_MESSAGES_COUNTER_SHARDS_COUNT;
    shardId++
  ) {
    batch.set(counterCollectionRef.doc(shardId.toString()), {
      count: shardId === 0 ? messagesRef.length : 0,
    });
  }
  batch.set(counterCollectionRef.doc("sum"), { value: messagesRef.length });
  await batch.commit();

  const otherShardIds = difference(
    allShards.map((x) => x.id),
    [
      ...range(0, VENUE_CHAT_MESSAGES_COUNTER_SHARDS_COUNT).map((x) =>
        x.toString()
      ),
      "sum",
    ]
  );
  if (otherShardIds.length > 0) {
    console.log(`Removing ${otherShardIds.length} invalid shards...`);

    await Promise.all(
      chunk(otherShardIds, BATCH_MAX_OPS).map((chunk: string[]) => {
        const batch = app.firestore().batch();
        chunk.forEach((shardId) => {
          batch.delete(counterCollectionRef.doc(shardId));
        });
        return batch.commit();
      })
    );
  }
};

const deleteOldSchemaMessages = async (
  chatsRef: CollectionReference,
  field: string
) => {
  const firestore = app.firestore();

  const { docs: messagesToDelete } = await chatsRef.orderBy(field).get();
  console.log(
    `\tDeleting ${messagesToDelete.length} old schema messages with '${field}' field...`
  );

  return Promise.all(
    chunk(messagesToDelete, BATCH_MAX_OPS).map(
      (chunk: QueryDocumentSnapshot<DocumentData>[]) => {
        const batch = firestore.batch();
        chunk.forEach((x) => batch.delete(x.ref));
        return batch.commit();
      }
    )
  );
};

const cleanupThreads = async (chatsRef: CollectionReference) => {
  const firestore = app.firestore();
  const { docs: threadMessages } = await chatsRef.orderBy("threadId").get();
  console.log(
    `\tMoving ${threadMessages.length} thread messages to corresponding collections..`
  );

  const byThreadId: Record<
    string,
    QueryDocumentSnapshot<DocumentData>[]
  > = groupBy(threadMessages, (x) => x.data().threadId);

  const nonExistentThreadIds = [];
  for (const threadId of Object.keys(byThreadId)) {
    const threadSnap = await chatsRef.doc(threadId).get();
    if (!threadSnap.exists) {
      nonExistentThreadIds.push(threadId);
      continue;
    }

    const thread = byThreadId[threadId];

    await Promise.all(
      chunk(thread, BATCH_MAX_OPS / 2).map(
        (chunk: QueryDocumentSnapshot<DocumentData>[]) => {
          const batch = firestore.batch();
          chunk.forEach((x) => {
            batch.create(threadSnap.ref.collection("thread").doc(), x.data());
            batch.delete(x.ref);
          });
          return batch.commit();
        }
      )
    );

    await threadSnap.ref.update({
      repliesCount: thread.length,
    });
  }

  console.log(
    `\tDeleting messages in ${nonExistentThreadIds.length} non existent treads...`
  );
  for (const danglingThreadId of nonExistentThreadIds) {
    const thread = byThreadId[danglingThreadId];

    await Promise.all(
      chunk(thread, BATCH_MAX_OPS).map(
        (chunk: QueryDocumentSnapshot<DocumentData>[]) => {
          const batch = firestore.batch();
          chunk.forEach((x) => {
            batch.delete(x.ref);
          });
          return batch.commit();
        }
      )
    );
  }
};

(async () => {
  const firestore = app.firestore();

  if (
    venueId &&
    !(await firestore.collection("venues").doc(venueId).get()).exists
  ) {
    console.log(`Venue ${venueId} does not exist.`);
    return;
  }

  const venueRefs = venueId
    ? [firestore.collection("venues").doc(venueId)]
    : await firestore.collection("venues").listDocuments();

  for (const venueRef of venueRefs) {
    console.log(`Processing venue ${venueRef.id}`);
    const chatsRef = venueRef.collection("chats");

    await deleteOldSchemaMessages(chatsRef, "deleted");
    await deleteOldSchemaMessages(chatsRef, "from");
    await deleteOldSchemaMessages(chatsRef, "ts_utc");
    await cleanupThreads(chatsRef);

    await updateChatMessagesCounter(venueRef);
  }
})();
