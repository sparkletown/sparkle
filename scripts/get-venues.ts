#!/usr/bin/env node -r esm -r ts-node/register

import admin from "firebase-admin";
import { initFirebaseAdminApp } from "./lib/helpers";

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------  
${scriptName}: Get venue details. Prints venue name, type and other details.

Usage: node ${scriptName} PROJECT_ID

Example: node ${scriptName} co-reality-map
---------------------------------------------------------
`;

  console.log(helpText);
  process.exit(1);
};

const [projectId] = process.argv.slice(2);
if (!projectId) {
  usage();
}

initFirebaseAdminApp(projectId);

(async () => {
  const allUsers: admin.auth.UserRecord[] = [];

  let nextPageToken: string;
  const { users, pageToken } = await admin.auth().listUsers(1000);

  allUsers.push(...users);
  nextPageToken = pageToken;

  while (nextPageToken) {
    const { users, pageToken } = await admin
      .auth()
      .listUsers(1000, nextPageToken);

    allUsers.push(...users);
    nextPageToken = pageToken;
  }

  console.log(
    [
      "Venue ID",
      "Venue Name",
      "Venue Type",
      "Tagline",
      "Long Description",
      "Zoom URL (if applicable)",
      "iframe URL (if applicable)",
      "Owner emails",
    ]
      .map((heading) => `"${heading}"`)
      .join(",")
  );

  const firestoreVenues = await admin.firestore().collection("venues").get();

  firestoreVenues.docs.forEach((doc) => {
    const venueId = doc.id;
    const venueName = doc.data().name;
    const venueTemplate = doc.data().template;
    const tagline = doc.data().config?.landingPageConfig?.subtitle;
    const longDescription = doc.data().config?.landingPageConfig?.description;
    const zoomUrl = doc.data().zoomUrl ?? "";
    const iframeUrl = doc.data().iframeUrl ?? "";
    const ownerEmails = (doc.data().owners ?? []).map(
      (ownerUid: string) => allUsers.find((u) => u.uid === ownerUid).email
    );

    console.log(
      [
        venueId,
        venueName,
        venueTemplate,
        tagline,
        longDescription,
        zoomUrl,
        iframeUrl,
        ownerEmails.join(","),
      ]
        .map(
          (v) =>
            `"${(v ?? "")
              .split('"')
              .join('\\"')
              .split(",")
              .join("\\,")
              .split("\n")
              .join(" ")}"`
        )
        .join(",")
    );
  });

  process.exit(0);
})();
