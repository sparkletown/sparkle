#!/usr/bin/env node -r esm -r ts-node/register

import { MigrateOptions } from "fireway";

const findSpaceByName = (spaces, worldId, name) =>
  spaces.find((space) => space.worldId === worldId && space.name === name) ||
  spaces.find((space) => space.worldId === worldId && space.id === name);

export const migrate = async ({ firestore }: MigrateOptions) => {
  console.log(`Fetching spaces...`);

  const { docs: spaceDocs } = await firestore.collection("venues").get();

  console.log(`Updating spaces...`);

  const spaces = spaceDocs.map((spaceDoc) => ({
    ...spaceDoc.data(),
    id: spaceDoc.id,
  }));

  try {
    for (const spaceDoc of spaceDocs) {
      const spaceData = spaceDoc.data();

      const { docs: eventDocs } = await spaceDoc.ref.collection("events").get();
      console.log(`${spaceDoc.id} has events ${eventDocs.length}`);

      for (const eventDoc of eventDocs) {
        const event = eventDoc.data();
        if (!event.room) {
          continue;
        }

        const targetSpace = findSpaceByName(
          spaces,
          spaceData.worldId,
          event.room
        );
        if (!targetSpace) {
          console.log(
            `WARN: Cannot find space for event ${eventDoc.id} with room ${event.room} in ${spaceDoc.id}`
          );
          continue;
        }

        await eventDoc.ref.update({
          worldId: spaceData.worldId,
          spaceId: targetSpace.id,
        });
      }
    }
  } catch (error) {
    console.log("The script failed to update all of the spaces. Error:");
    console.log(error);
    return;
  }

  console.log("Events have been updated successfully, script ended.");
};
