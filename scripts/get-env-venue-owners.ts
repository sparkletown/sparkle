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
  usageParams: "[CREDENTIAL_PATH]",
  exampleParams: "[theMatchingAccountServiceKey.json]",
});

const [credentialPath] = process.argv.slice(2);

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

  fs.writeFileSync("./venueOwners.csv", `${headingLine} \n`, { flag: "a" });

  venues.forEach((doc) => {
    if (!doc.exists) return;

    const dto = [
      doc.id,
      doc.data().name,
      doc
        .data()
        .owners?.map(
          (uid: string) => allUsers.find((u) => u.uid === uid)?.email ?? uid
        ) || [],
    ];

    const csvFormattedLine = dto.map((s) => `"${s} "`).join(",");

    fs.writeFileSync("./venueOwners.csv", `${csvFormattedLine} \n`, {
      flag: "a",
    });
  });

  process.exit(0);
})();
