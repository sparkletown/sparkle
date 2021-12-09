#!/usr/bin/env node -r esm -r ts-node/register

import { MigrateOptions } from "fireway";

const VENUE_CHAT_MESSAGES_COUNTER_SHARDS_COUNT = 10;

const initializeSpaceChatMessagesCounter = async (spaceDoc) => {
  const counterCollection = spaceDoc.ref.collection("chatMessagesCounter");
  for (
    let shardId = 0;
    shardId < VENUE_CHAT_MESSAGES_COUNTER_SHARDS_COUNT;
    shardId++
  ) {
    await counterCollection.doc(shardId.toString()).set({ count: 0 });
  }
  await counterCollection.doc("sum").set({ value: 0 });
};

export const migrate = async ({ firestore }: MigrateOptions) => {
  console.log(`Fetching spaces...`);

  const { docs: spaceDocs } = await firestore.collection("venues").get();

  console.log(`Updating spaces...`);

  try {
    for (const spaceDoc of spaceDocs) {
      const { docs: counterDocs } = await spaceDoc.ref
        .collection("chatMessagesCounter")
        .get();
      if (counterDocs.length !== 0) {
        console.log(`${spaceDoc.id} has chat counters. Skipping.`);
        continue;
      }
      console.log(`${spaceDoc.id} has no chat counters. Creating.`);
      await initializeSpaceChatMessagesCounter(spaceDoc);
    }
  } catch (error) {
    console.log("The script failed to update all of the spaces. Error:");
    console.log(error);
    return;
  }

  console.log("Finished successfully.");
};
