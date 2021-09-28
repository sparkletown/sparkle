#!/usr/bin/env node -r esm -r ts-node/register

import { chunk } from "lodash";

import {
  checkFileExists,
  initFirebaseAdminApp,
  makeScriptUsage,
  parseCredentialFile,
} from "./lib/helpers";

const sleep: (ms: number) => Promise<void> = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

const usage = makeScriptUsage({
  description: "Update users recent seat time for auditorium",
  usageParams: "{venueId} {credentials_path}",
  exampleParams: "myauditorium co-reality-staging-30f7b0b5de9a.json",
});

const [venueId, credentialPath] = process.argv.slice(2);

if (!venueId || !credentialPath) {
  usage();
  process.exit(1);
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

process.on("SIGINT", () => {
  process.exit(1);
});

const app = initFirebaseAdminApp(projectId, { credentialPath });

(async () => {
  const venueDoc = await app
    .firestore()
    .collection("venues")
    .doc(venueId)
    .get();

  if (!venueDoc || !venueDoc.exists) {
    console.log(`Venue ${venueId} does not exist. Exiting...`);
    return;
  }

  const { docs: sectionDocs } = await venueDoc.ref.collection("sections").get();

  console.log(`Found ${sectionDocs.length} sections...`);
  await sleep(500);

  const usersDocArray = await Promise.all(
    sectionDocs.map((s) =>
      s.ref
        .collection("seatedSectionUsers")
        .get()
        .then(({ docs }) => ({ docs, sectionId: s.id }))
    )
  );
  const userDocs = usersDocArray.flatMap(({ sectionId, docs }) =>
    docs.map((user) => ({ user, sectionId }))
  );

  console.log(`Found ${userDocs.length} users...\n`);
  await sleep(500);

  await Promise.all(
    chunk(userDocs, 500).map((userDocsChunk) => {
      const batch = app.firestore().batch();
      userDocsChunk.forEach(({ user, sectionId }) => {
        const withTimestamp = {
          template: "auditorium",
          venueId,
          venueSpecificData: {
            sectionId,
          },
          lastSittingTimeMs: Date.now(),
        };

        batch.set(
          app
            .firestore()
            .collection("venues")
            .doc(venueId)
            .collection("recentSeatedUsers")
            .doc(user.id),
          withTimestamp
        );
      });

      console.log(`Staging ${userDocsChunk.length} users for update...`);
      return batch.commit();
    })
  );
})();
