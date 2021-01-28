#!/usr/bin/env node --experimental-json-modules --loader ts-node/esm

import admin from "firebase-admin";

import { initFirebaseAdminApp } from "./lib/helpers.js";

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------  
${scriptName}: Count the users that have entered the venue(s) specified

Usage: node ${scriptName} PROJECT_ID VENUE_IDS

Example: node ${scriptName} co-reality-map venueId,venueId2,venueIdN
---------------------------------------------------------
`;

  console.log(helpText);
  process.exit(1);
};

const [projectId, venueIds] = process.argv.slice(2);
if (!projectId || !venueIds) {
  usage();
}

const venueIdsArray = venueIds.split(",");

initFirebaseAdminApp(projectId);

(async () => {
  venueIdsArray.map(async (venueId) => {
    const snapshot = await admin
      .firestore()
      .collection("users")
      .where("enteredVenueIds", "array-contains", venueId)
      .get();

    console.log(venueId, ":", snapshot.docs.length);
  });

  if (venueIdsArray.length > 1) {
    const snapshot = await admin
      .firestore()
      .collection("users")
      .where("enteredVenueIds", "array-contains-any", venueIdsArray)
      .get();

    console.log(venueIds, "(combined): ", snapshot.docs.length);
  }
})();
