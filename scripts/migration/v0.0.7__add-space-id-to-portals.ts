#!/usr/bin/env node -r esm -r ts-node/register

import { MigrateOptions } from "fireway";

const findSpaceByName = (spaces, worldId, name) =>
  spaces.find((space) => space.worldId === worldId && space.name === name) ||
  spaces.find((space) => space.worldId === worldId && space.id === name);

const findSpaceBySlug = (spaces, worldId, slug) =>
  spaces.find((space) => {
    return space.worldId === worldId && space.slug === slug;
  });

const findSpaceId = (spaces, worldId, url: string) => {
  // This might capture too many, but, URL matching is always going to be a
  // bit rubbish
  if (url.indexOf("/in/") === -1) {
    return;
  }

  if (url.indexOf("/w/") !== -1) {
    // new style URL, match on slug
    const spaceSlugToFind = url.split("/").slice(-1)[0];
    const space = findSpaceBySlug(spaces, worldId, spaceSlugToFind);
    if (space) {
      return space.id;
    }
  } else {
    // old stlye URL, match on name
    const spaceNameToFind = url.split("/").slice(-1);
    const space = findSpaceByName(spaces, worldId, spaceNameToFind);
    if (space) {
      return space.id;
    }
  }
  return;
};

type SpaceFields = {
  id: string;
  name: string;
};

type PortalFields = {
  url: string;
};

export const migrate = async ({ firestore }: MigrateOptions) => {
  console.log(`Fetching spaces...`);

  const { docs: spaceDocs } = await firestore.collection("venues").get();

  console.log(`Updating spaces...`);

  const spaces = spaceDocs.map(
    (spaceDoc) =>
      ({
        ...spaceDoc.data(),
        id: spaceDoc.id,
      } as SpaceFields)
  );

  try {
    for (const spaceDoc of spaceDocs) {
      const spaceData = spaceDoc.data();

      if (!spaceData.rooms || spaceData.rooms.length === 0) {
        continue;
      }
      console.log(`${spaceDoc.id} has ${spaceData.rooms.length} rooms`);

      const rooms = spaceData.rooms.map((room: PortalFields) => {
        const spaceId = findSpaceId(spaces, spaceData.worldId, room.url);
        if (!spaceId) {
          console.log(`Could not find space for room with url ${room.url}`);
          return room;
        }
        return {
          ...room,
          spaceId,
        };
      });

      await firestore.collection("venues").doc(spaceDoc.id).update({ rooms });
    }
  } catch (error) {
    console.log("The script failed to update all of the spaces. Error:");
    console.log(error);
    return;
  }

  console.log("Events have been updated successfully, script ended.");
};
