#!/usr/bin/env node -r esm -r ts-node/register

import fs from "fs";
import admin from "firebase-admin";
import { initFirebaseAdminApp } from "./lib/helpers";

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------  
${scriptName}: Print attendees' emails, based on codes_used

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

const CODES_FILE_PATH = "codes.txt";
const codes = fs
  .readFileSync(CODES_FILE_PATH)
  .toString()
  .split("\n")
  .map((line) => line.toLowerCase());

initFirebaseAdminApp(projectId);

(async () => {
  const userprivateCollection = await admin
    .firestore()
    .collection("userprivate")
    .get();

  const codesUsed = [];

  userprivateCollection.forEach((doc) => {
    if (!doc.exists || !doc.data().codes_used) return;
    doc.data().codes_used.map((c) => codesUsed.push(c));
  });

  const emailsWhoLoggedIn = codes.filter((code) => codesUsed.includes(code));

  console.log(
    `Email addresses of users who logged in (total ${emailsWhoLoggedIn.length}):`
  );

  emailsWhoLoggedIn.sort().forEach((e) => console.log(e));

  process.exit(0);
})();
