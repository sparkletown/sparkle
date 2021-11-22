#!/usr/bin/env node -r esm -r ts-node/register

import { generateSlug } from "../../functions/src/utils/venue";
import {
  checkFileExists,
  initFirebaseAdminApp,
  makeScriptUsage,
  parseCredentialFile,
} from "../lib/helpers";

const usage = makeScriptUsage({
  description: `Generates and adds a slug for the spaces that are missing it.`,
  usageParams: `CREDENTIAL_PATH`,
  exampleParams: `fooAccountKey.json`,
});

const [credentialPath] = process.argv.slice(2);

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

const app = initFirebaseAdminApp(projectId, { credentialPath });

(async () => {
  console.log(`Fetching spaces...`);

  const spaces = await app.firestore().collection("venues").get();

  console.log(`Updating spaces...`);

  try {
    for (const space of spaces.docs) {
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
        console.log(`Skipping space ${spaceData.name}. Slug already exists`);
        continue;
      }

      const slug = generateSlug(spaceData.name);

      const spaceWithSlug = {
        ...spaceData,
        slug,
      };

      await space.ref.set(spaceWithSlug);
      console.log(
        `The slug: '${slug}' has been successfully added for venue: ${spaceData.name}`
      );
    }
  } catch (error) {
    console.log("The script failed to update all of the spaces. Error:");
    console.log(error);
  }

  console.log("Slugs have been added successfully, script ended.");
})();
