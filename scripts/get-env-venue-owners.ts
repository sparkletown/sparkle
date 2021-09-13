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
  description:
    "Print venue owners' email addresses ignoring specified users if needed.",
  usageParams: "[CREDENTIAL_PATH] emailSubstrToIgnore",
  exampleParams: "[theMatchingAccountServiceKey.json] @gmail.com",
});

const [credentialPath, ...emailSubstrToIgnore] = process.argv.slice(2);

if (!credentialPath) {
  usage();
}

const { project_id: projectId } = parseCredentialFile(credentialPath);

if (!projectId) {
  console.error("Credential file has no project_id:", credentialPath);
  process.exit(1);
}

const outputFileName = `${projectId}-venue-owners.csv`;

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
  fs.writeFileSync(outputFileName, "");

  const headingLine = ["Venue Id", "Venue Name", "Venue Owners"]
    .map((heading) => `"${heading}"`)
    .join(",");

  fs.writeFileSync(outputFileName, `${headingLine}\n`, { flag: "a" });

  const existingUsers = allUsers.filter((user) => user.email?.includes("@"));
  const filteredUsers = emailSubstrToIgnore?.length
    ? existingUsers.filter(
        (user) =>
          !emailSubstrToIgnore.some((substrToExclude) =>
            user?.email?.includes(substrToExclude)
          )
      )
    : existingUsers;

  venues.forEach((doc) => {
    if (!doc.exists) return;

    const venueOwners = doc
      .data()
      .owners?.map(
        (uid: string) => filteredUsers.find((u) => u.uid === uid)?.email ?? ""
      )
      .filter((owner: string) => owner);
    const venueData = [doc.id, doc.data().name, venueOwners ?? ""];

    const csvFormattedLine = venueData.map((s) => `"${s}"`).join(",");

    fs.writeFileSync(outputFileName, `${csvFormattedLine}\n`, {
      flag: "a",
    });
  });

  console.log("Venue owners are successfully extracted to", outputFileName);
  process.exit(0);
})();
