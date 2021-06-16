#!/usr/bin/env node -r esm -r ts-node/register

import {
  checkFileExists,
  // findUserByEmail,
  // initFirebaseAdminApp,
  makeScriptUsage,
  parseCredentialFile,
} from "../lib/helpers";

const usage = makeScriptUsage({
  description: "Bulk upload events from a spreadsheet ",
  usageParams: "CREDENTIAL_PATH VENUE_ID FILE",
  exampleParams: "fooAccountKey.json foouser@example.com baruser@example.com",
});

const [credentialPath, venueId, filePath] = process.argv.slice(2);

if (!credentialPath || !venueId || !filePath) {
  usage();
}

if (!checkFileExists(credentialPath)) {
  console.error("Credential file path does not exists:", credentialPath);
  process.exit(1);
}

const { project_id: projectId } = parseCredentialFile(credentialPath);

if (!projectId) {
  console.error("Credential file has no project_id:", credentialPath);
  process.exit(1);
}

// const app = initFirebaseAdminApp(projectId, { credentialPath });

// (async () => {
//   const event = {
//     name,
//   };
//   firebase
//     .firestore()
//     .doc(`venues/${venueId}`)
//     .collection("events")
//     .add(event)
//     .catch(function (err) {
//       console.error("Add event error:", err);
//     });
// })();
