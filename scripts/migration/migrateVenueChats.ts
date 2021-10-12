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

const checkExistsChatMessagesCounter = async (
  venueRef: DocumentReference
): Promise<boolean> => {
  const shardIds = (
    await venueRef.collection("chatMessagesCounter").listDocuments()
  ).map((x) => x.id);
  return (
    difference(
      [...range(0, VENUE_CHAT_MESSAGES_COUNTER_SHARDS_COUNT), "sum"],
      shardIds
    ).length === 0
  );
};

const initializeVenueChatMessagesCounter = (venueRef: DocumentReference) => {
  console.log("\tInit chatMessagesCounter...");
  const batch = app.firestore().batch();
  const counterCollection = venueRef.collection("chatMessagesCounter");
  for (
    let shardId = 0;
    shardId < VENUE_CHAT_MESSAGES_COUNTER_SHARDS_COUNT;
    shardId++
  ) {
    batch.set(counterCollection.doc(shardId.toString()), { count: 0 });
  }
  batch.set(counterCollection.doc("sum"), { value: 0 });
  return batch.commit();
};

const hardDeleteMessages = async (chatsRef: CollectionReference) => {
  const firestore = app.firestore();

  const { docs: messagesToDelete } = await chatsRef
    .where("delete", "==", true)
    .get();
  console.log(`\tHard deleting ${messagesToDelete.length} messages...`);

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
  > = groupBy(threadMessages, "id");

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

  const venueRefs = venueId
    ? [firestore.collection("venueRefs").doc(venueId)]
    : await firestore.collection("venueRefs").listDocuments();

  for (const venueRef of venueRefs) {
    console.log("Working on venue ", venueRef.id);
    const chatsRef = venueRef.collection("chats");

    if (!(await checkExistsChatMessagesCounter(venueRef)))
      await initializeVenueChatMessagesCounter(venueRef);

    await hardDeleteMessages(chatsRef);
    await cleanupThreads(chatsRef);
  }
})();
