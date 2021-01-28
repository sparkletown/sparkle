#!/usr/bin/env node -r esm -r ts-node/register
import admin from "firebase-admin";

import { initFirebaseAdminApp } from "./lib/helpers";

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------  
${scriptName}: Get venue details. Prints venue name, type and other details.

Usage: node ${scriptName} PROJECT_ID VENUE_ID TARGET_VENUE_ID

Example: node ${scriptName} co-reality-staging myspanishroom myenglishroom
---------------------------------------------------------
`;

  console.log(helpText);
  process.exit(1);
};

const [projectId, sourceVenueId, destVenueId] = process.argv.slice(2);
if (!projectId || !sourceVenueId || !destVenueId) {
  usage();
}

initFirebaseAdminApp(projectId);

(async () => {
  const sourceVenue = await admin
    .firestore()
    .doc(`venues/${sourceVenueId}`)
    .get();

  if (!sourceVenue.exists) {
    console.error(`Venue ${sourceVenueId} does not exist; exiting`);
    process.exit(1);
  }

  console.log(`Got venue ${sourceVenueId}`);
  console.log(`Writing to ${destVenueId}...`);

  await admin
    .firestore()
    .doc(`venues/${destVenueId}`)
    .set(sourceVenue.data() ?? {});

  console.log("Done");
  process.exit(0);
})();
