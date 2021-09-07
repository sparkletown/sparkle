#!/usr/bin/env node -r esm -r ts-node/register

import fs from "fs";
import { resolve } from "path";

import admin from "firebase-admin";

import {
  initFirebaseAdminApp,
  makeScriptUsage,
  parseCredentialFile,
} from "./lib/helpers";

const usage = makeScriptUsage({
  description: "Print venue owners' email addresses.",
  usageParams: "[CREDENTIAL_PATH] filterArray",
  exampleParams: "[theMatchingAccountServiceKey.json] gmail.com",
});

const [credentialPath, ...filterArray] = process.argv.slice(2);

if (!credentialPath) {
  usage();
}

const { project_id: projectId } = parseCredentialFile(credentialPath);

if (!projectId) {
  console.error("Credential file has no project_id:", credentialPath);
  process.exit(1);
}

initFirebaseAdminApp(projectId, {
  credentialPath: credentialPath
    ? resolve(__dirname, credentialPath)
    : undefined,
});

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

  // @debt This function will currently load all venues in firebase into memory.. not very efficient
  const firestoreVenues = await admin.firestore().collection("venues").get();
  const venues = firestoreVenues.docs;

  // clear file
  fs.writeFileSync("./venueOwners.csv", "");

  const headingLine = ["Venue Id", "Venue Name", "Venue Owners"]
    .map((heading) => `"${heading}"`)
    .join(",");

  fs.writeFileSync("./venueOwners.csv", `${headingLine}\n`, { flag: "a" });
  const filteredUsers = filterArray?.length
    ? allUsers.filter(
        (user) =>
          user?.email?.includes("@") &&
          !filterArray.some((filterEmail) => user?.email?.includes(filterEmail))
      )
    : allUsers;

  venues.forEach((doc) => {
    if (!doc.exists) return;
    const venueOwners = doc
      .data()
      .owners?.map(
        (uid: string) => filteredUsers.find((u) => u.uid === uid)?.email ?? ""
      );

    // venue owners that have email
    const filteredVenueOwners = venueOwners?.filter((owner: string) =>
      owner.includes("@")
    );

    const venueData = [
      doc.id,
      doc.data().name,
      filteredVenueOwners.length
        ? venueOwners.filter((owner: string) => !!owner)
        : "",
    ];

    const csvFormattedLine = venueData.map((s) => `"${s}"`).join(",");

    fs.writeFileSync("./venueOwners.csv", `${csvFormattedLine}\n`, {
      flag: "a",
    });
  });

  process.exit(0);
})();
