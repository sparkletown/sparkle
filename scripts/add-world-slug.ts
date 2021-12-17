#!/usr/bin/env node -r esm -r ts-node/register

import { generateSlug } from "../functions/src/utils/venue";

import {
  checkFileExists,
  initFirebaseAdminApp,
  makeScriptUsage,
  parseCredentialFile,
} from "./lib/helpers";

const usage = makeScriptUsage({
  description: `Generates and adds a slug for the worlds that are missing it.`,
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
  console.log(`Fetching worlds...`);

  const worlds = await app.firestore().collection("worlds").get();

  console.log(`Updating worlds...`);

  for (const world of worlds.docs) {
    const worldData = world.data();

    if (worldData.slug) return;

    const slug = generateSlug(worldData.name);

    const slugWorld = {
      ...worldData,
      slug,
    };

    await world.ref.set(slugWorld);
    console.log(
      `The slug: '${slug}' has been successfully added for world: ${worldData.name}`
    );
  }

  console.log(`Slugs have been added successfully, script ended.`);
})();
