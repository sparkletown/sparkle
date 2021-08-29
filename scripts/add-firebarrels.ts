#!/usr/bin/env node -r esm -r ts-node/register

import {
  checkFileExists,
  initFirebaseAdminApp,
  makeScriptUsage,
} from "./lib/helpers";

const usage = makeScriptUsage({
  description: `Bulk add screening room videos`,
  usageParams: `PROJECT_ID VENUE_ID SCREENING_VIDEOS_CSV_PATH CREDENTIAL_PATH`,
  exampleParams: `co-reality-sparkle bootstrap fooAccountKey.json`,
});

const [projectId, venueId, credentialPath] = process.argv.slice(2);

if (!projectId || !credentialPath || !venueId) {
  usage();
}

if (!checkFileExists(credentialPath)) {
  console.error("Credential file path does not exists:", credentialPath);
  process.exit(1);
}

const app = initFirebaseAdminApp(projectId, { credentialPath });

const appBatch = app.firestore().batch();

(async () => {
  Array(5)
    .fill({
      coordinateX: 1000,
      coordinateY: 1000,
      maxUserCount: 6,
      isLocked: false,
      connectedUsers: [],
      iconSrc: "assets/images/AnimateMap/barrels/barrel.png",
    })
    .forEach((firebarrel) => {
      const screeningVideoRef = app
        .firestore()
        .collection("venues")
        .doc(venueId)
        .collection("screeningRoomVideos")
        .doc();

      console.log(firebarrel);

      appBatch.set(screeningVideoRef, firebarrel);
    });

  await appBatch.commit();

  console.log(`Succesfully added firebarrels to the ${venueId} venue.`);
})();
