#!/usr/bin/env node -r esm -r ts-node/register

import { chunk } from "lodash";

import { COLLECTION_SEATED_USERS_CHECKINS } from "settings";

import {
  checkFileExists,
  initFirebaseAdminApp,
  makeScriptUsage,
  parseCredentialFile,
} from "./lib/helpers";
import { DocumentData, QueryDocumentSnapshot } from "./lib/types";

const sleep: (ms: number) => Promise<void> = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

const usage = makeScriptUsage({
  description: "Update users recent seat time for all auditoriums",
  usageParams: "/path/to/credentials.json",
  exampleParams: "co-reality-staging-30f7b0b5de9a.json",
});

const [credentialPath] = process.argv.slice(2);

if (!credentialPath) {
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

const now = Date.now();

(async () => {
  const { docs: userDocs } = await app
    .firestore()
    .collectionGroup("seatedSectionUsers")
    .get();

  console.log(`Found ${userDocs.length} seated users in auditoriums...`);
  await sleep(500);

  await Promise.all(
    chunk(userDocs, 500).map(
      (userDocsChunk: QueryDocumentSnapshot<DocumentData>[]) => {
        const batch = app.firestore().batch();
        userDocsChunk.forEach((userDoc) => {
          const { path } = userDoc.data();
          const { sectionId, venueId } = path;
          if (!sectionId || !venueId)
            console.warn(`Invalid path in user ${userDoc.id}`);

          const withTimestamp = {
            template: "auditorium",
            venueId,
            venueSpecificData: {
              sectionId,
            },
            lastSittingTimeMs: now,
          };

          console.log(userDoc.id);
          batch.set(
            app
              .firestore()
              .collection("venues")
              .doc(venueId)
              .collection(COLLECTION_SEATED_USERS_CHECKINS)
              .doc(userDoc.id),
            withTimestamp
          );
        });

        console.log(`Staging ${userDocsChunk.length} users for update...`);
        return batch.commit();
      }
    )
  );
})();
