#!/usr/bin/env node -r esm -r ts-node/register
import { resolve } from "path";
import {
  initFirebaseAdminApp,
  makeScriptUsage,
  // parseCredentialFile,
} from "./lib/helpers";
import admin from "firebase-admin";
import { writeFileSync } from "fs";
// import ObjectToCsv from "objects-to-csv";

const usage = makeScriptUsage({
  description: "Bulk upload events from a spreadsheet ",
  usageParams: "PROJECT_ID CREDENTIAL_PATH",
  exampleParams: "co-reality-staging add-event-by-csv.example.csv key.json",
});

const [projectId, credentialPath] = process.argv.slice(2);

if (!credentialPath) {
  usage();
}

initFirebaseAdminApp(projectId, {
  credentialPath: credentialPath
    ? resolve(__dirname, credentialPath)
    : undefined,
});

const runner = async () => {
  const allUsers: admin.auth.UserRecord[] = [];
  let nextPageToken: string | undefined;
  const { users, pageToken } = await admin.auth().listUsers(10);

  allUsers.push(...users);
  nextPageToken = pageToken;

  while (nextPageToken) {
    const { users, pageToken } = await admin
      .auth()
      .listUsers(1000, nextPageToken);
    allUsers.push(...users);
    nextPageToken = pageToken;
  }
  let csv = [
    "Email",
    "Party Name",
    "Full name",
    "Company title",
    "Company department",
    "I'm loving this song - book - show: ",
    "Last Sign In",
  ].join(",");
  csv += "\n";

  const firestoreUsers = await admin.firestore().collection("users").get();
  firestoreUsers.docs.forEach((doc) => {
    const user = allUsers.find((u) => u.uid === doc.id);
    const partyName = doc.data().partyName;
    const realName = doc.data().realName;
    const companyTitle = doc.data().companyTitle;
    const companyDepartment = doc.data().companyDepartment;
    const Q2 = doc.data()["I'm loving this song - book - show: "];
    const lastSignInTime = new Date(doc.data().lastSeenAt).getTime();
    csv += [
      user?.email ?? doc.id,
      partyName,
      realName,
      companyTitle,
      companyDepartment,
      Q2,
      lastSignInTime ? new Date(lastSignInTime).toISOString() : "never",
    ].join(",");
    csv += "\n";
  });
  writeFileSync("reports.csv", csv);
  process.exit(0);
};

runner();
