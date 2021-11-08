import { MigrateOptions } from "fireway";
import { chunk, difference, groupBy, range } from "lodash";

import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
} from "../lib/types";

const BATCH_MAX_OPS = 500;
const VENUE_CHAT_MESSAGES_COUNTER_SHARDS_COUNT = 10;

const updateChatMessagesCounter = async (
  firestore: FirebaseFirestore.Firestore,
  venueRef: DocumentReference
) => {
  const batch = firestore.batch();
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
        const batch = firestore.batch();
        chunk.forEach((shardId) => {
          batch.delete(counterCollectionRef.doc(shardId));
        });
        return batch.commit();
      })
    );
  }
};

const deleteOldSchemaMessages = async (
  firestore: FirebaseFirestore.Firestore,
  chatsRef: CollectionReference,
  field: string
) => {
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

const cleanupThreads = async (
  firestore: FirebaseFirestore.Firestore,
  chatsRef: CollectionReference
) => {
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

const getVenueRefs = async (
  firestore: FirebaseFirestore.Firestore,
  venueId?: string
) => {
  if (
    venueId &&
    !(await firestore.collection("venues").doc(venueId).get()).exists
  ) {
    console.log(`Venue ${venueId} does not exist.`);
    return;
  }

  return venueId
    ? [firestore.collection("venues").doc(venueId)]
    : await firestore.collection("venues").listDocuments();
};

export const migrate = async ({ firestore }: MigrateOptions) => {
  const venueRefs = await getVenueRefs(firestore);
  if (!venueRefs) {
    return;
  }

  for (const venueRef of venueRefs) {
    console.log(`Processing venue ${venueRef.id}`);
    const chatsRef = venueRef.collection("chats");

    await deleteOldSchemaMessages(firestore, chatsRef, "deleted");
    await deleteOldSchemaMessages(firestore, chatsRef, "from");
    await deleteOldSchemaMessages(firestore, chatsRef, "ts_utc");
    await cleanupThreads(firestore, chatsRef);

    await updateChatMessagesCounter(firestore, venueRef);
  }
};
