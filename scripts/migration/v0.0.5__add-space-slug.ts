#!/usr/bin/env node -r esm -r ts-node/register

import { MigrateOptions } from "fireway";

import { generateSlug } from "../../functions/src/utils/venue";

export const migrate = async ({ firestore }: MigrateOptions) => {
  console.log(`Fetching spaces...`);

  const { docs: spaces } = await firestore.collection("venues").get();

  console.log(`Updating spaces...`);

  try {
    for (const space of spaces) {
      const spaceData = space.data();

      // If the space doesn't have a name, skip the space because it's impossible to generate a slug.
      if (!spaceData.name) {
        console.log(
          `Skipping space, name is missing and slug couldn't be generated. Space id: ${space.id}, space's world id: ${spaceData.worldId}.`
        );
        continue;
      }

      // If the space already has a slug, skip the space because it will override it.
      if (spaceData.slug) {
        console.log(
          `Skipping space ${spaceData.name} (${space.id}). Slug already exists`
        );
        continue;
      }

      const slug = generateSlug(spaceData.name);

      await space.ref.update({ slug });
      console.log(
        `The slug: '${slug}' has been successfully added for venue: ${spaceData.name}`
      );
    }
  } catch (error) {
    console.log("The script failed to update all of the spaces. Error:");
    console.log(error);
    return;
  }

  console.log("Slugs have been added successfully, script ended.");
};
