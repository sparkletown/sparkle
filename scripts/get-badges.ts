#!/usr/bin/env node -r esm -r ts-node/register

import admin from "firebase-admin";
import { resolve } from "path";
import { initFirebaseAdminApp } from "./lib/helpers";

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------
${scriptName}: Get user details. Prints each user's email address, last seen time in milliseconds since epoch, and codes used.

Usage: node ${scriptName} PROJECT_ID VENUE_ID CREDENTIAL_PATH

Example: node ${scriptName} co-reality-map myawesomevenue prodAccountKey.json
---------------------------------------------------------
`;

  console.log(helpText);
  process.exit(1);
};

const [projectId, venueId, credentialPath] = process.argv.slice(2);
if (!projectId || !venueId || !credentialPath) {
  usage();
}

const app = initFirebaseAdminApp(projectId, {
  appName: projectId,
  credentialPath: resolve(__dirname, credentialPath),
});

(async () => {
  const allUsers: admin.auth.UserRecord[] = [];
  let nextPageToken: string | undefined;
  const { users, pageToken } = await app.auth().listUsers(1000);

  allUsers.push(...users);
  nextPageToken = pageToken;

  while (nextPageToken) {
    const { users, pageToken } = await app
      .auth()
      .listUsers(1000, nextPageToken);
    allUsers.push(...users);
    nextPageToken = pageToken;
  }

  console.log(
    ["Email", "Party Name", "Entered Venues", "Venue Visits:Time Spent"]
      .map((heading) => `"${heading}"`)
      .join(",")
  );

  const firestoreUsers = await app.firestore().collection("users").get();

  await Promise.all(
    firestoreUsers.docs.map(async (doc) => {
      const user = allUsers.find((u) => u.uid === doc.id);
      const partyName = doc.data().partyName;
      const enteredVenueIds = doc.data().enteredVenueIds;

      if (enteredVenueIds?.includes(venueId)) {
        const visitsCollection = await doc.ref.collection("visits").get();
        const visitsTimeSpent = visitsCollection.docs
          .filter((doc) => doc.exists)
          .map((doc) => `${doc.id}:${doc.data().timeSpent}`);

        console.log(
          [user?.email ?? doc.id, partyName, visitsTimeSpent.sort()]
            .map((v) => `"${v}"`)
            .join(",")
        );
      }
    })
  );

  process.exit(0);
})();
