#!/usr/bin/env node -r esm -r ts-node/register

import admin from "firebase-admin";
import { initFirebaseAdminApp } from "./lib/helpers";

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------  
${scriptName}: Print venue owners' email addresses

Usage: node ${scriptName} PROJECT_ID VENUE_ID

Example: node ${scriptName} co-reality-map myvenue
---------------------------------------------------------
`;

  console.log(helpText);
  process.exit(1);
};

const [projectId, venueId] = process.argv.slice(2);
if (!projectId || !venueId) {
  usage();
}

initFirebaseAdminApp(projectId);

(async () => {
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

  const firestoreVenues = await admin.firestore().collection("venues").get();
  const venues = firestoreVenues.docs.filter(
    (doc) =>
      doc.exists &&
      (doc.id === venueId ||
        (doc.data().parentId && doc.data().parentId === venueId))
  );

  venues.forEach((doc) => {
    if (!doc.exists) return;

    // For all venues, print venue id and owners
    console.log(
      `Venue: ${doc.id} (${doc.data().name}) is owned by emails: ${doc
        .data()
        .owners.map((uid) => allUsers.find((u) => u.uid === uid)?.email ?? uid)
        .join(", ")}`
    );
  });

  process.exit(0);
})();
