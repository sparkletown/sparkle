#!/usr/bin/env node -r esm -r ts-node/register

import { MigrateOptions } from "fireway";

const findSpaceByName = (owningSpace, spaces, worldId, roomName: string) => {
  // Attempt to find the room on the owning venue
  const targetRoom = owningSpace.rooms.find((room) => room.title === roomName);
  if (targetRoom) {
    if (targetRoom.url.startsWith("/in/")) {
      const spaceNameOrId = targetRoom.url.split("/").slice(-1)[0];
      const foundSpace =
        spaces.find(
          (space) => space.worldId === worldId && space.name === spaceNameOrId
        ) ||
        spaces.find(
          (space) => space.worldId === worldId && space.id === spaceNameOrId
        );
      if (foundSpace) {
        return foundSpace;
      }
    }
  }

  return (
    spaces.find(
      (space) => space.worldId === worldId && space.name === roomName
    ) ||
    spaces.find((space) => space.worldId === worldId && space.id === roomName)
  );
};

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
          spaceData,
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
