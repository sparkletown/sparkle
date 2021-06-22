#!/usr/bin/env node -r esm -r ts-node/register

import { resolve } from "path";

import admin from "firebase-admin";

import { initFirebaseAdminApp, makeScriptUsage } from "./lib/helpers";

const usage = makeScriptUsage({
  description: "Update events details: { venueId, sovereignVenueId }",
  usageParams: "PROJECT_ID [CREDENTIAL_PATH]",
  exampleParams: "co-reality-map [theMatchingAccountServiceKey.json]",
});

const [projectId, credentialPath] = process.argv.slice(2);

// Note: no need to check credentialPath here as initFirebaseAdmin defaults it when undefined
if (!projectId) {
  usage();
}

initFirebaseAdminApp(projectId, {
  credentialPath: credentialPath
    ? resolve(__dirname, credentialPath)
    : undefined,
});

(async () => {
  // // @debt This function will currently load all venues in firebase into memory.. not very efficient
  const venuesCollection = admin.firestore().collection("venues");
  const venueDocs = (await venuesCollection.get()).docs;

  venueDocs.forEach(async (doc) => {
    const venueId = doc.id;

    const events = await venuesCollection
      .doc(venueId)
      .collection("events")
      .get();

    events.forEach((eventDoc) => {
      const venueData = {
        venueId,
      };

      console.log(`updating event "${eventDoc.data().name}"`, venueData);
      eventDoc.ref.update(venueData);
    });
  });
})();
