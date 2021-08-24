#!/usr/bin/env node -r esm -r ts-node/register

import fs from "fs";
import { resolve } from "path";

import admin from "firebase-admin";

import { initFirebaseAdminApp, makeScriptUsage } from "./lib/helpers";

const usage = makeScriptUsage({
  description: "Print venue owners' email addresses.",
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

const getEnvVenueOwners = async () => {
  const { users, pageToken } = await admin.auth().listUsers(1000);

  const allUsers = [...users];
  let nextPageToken = pageToken;

  while (nextPageToken) {
    const { users, pageToken } = await admin
      .auth()
      .listUsers(1000, nextPageToken);
    allUsers.push(...users);
    nextPageToken = pageToken;
  }

  // @debt This function will currently load all venues in firebase into memory.. not very efficient
  const firestoreVenues = await admin.firestore().collection("venues").get();
  const venues = firestoreVenues.docs;

  // clear file
  fs.truncate("./venueOwners.csv", 0, () =>
    console.log("Venue Owners file cleared")
  );

  venues.forEach((doc) => {
    if (!doc.exists) return;

    fs.writeFileSync(
      "./venueOwners.csv",
      `Venue: ${doc.id} (${doc.data().name}) is owned by emails:
      ${doc
        .data()
        .owners.map(
          (uid: string) => allUsers.find((u) => u.uid === uid)?.email ?? uid
        )
        .join(", ")} \n`,
      { flag: "a" }
    );
  });

  process.exit(0);
};

export default getEnvVenueOwners;
