#!/usr/bin/env node -r esm -r ts-node/register

import fs from "fs";
import { resolve } from "path";

import admin from "firebase-admin";

import { VenueAccessMode } from "types/VenueAccessMode";

import "firebase/compat/firestore";

import { initFirebaseAdminApp, makeScriptUsage } from "./lib/helpers";

const usage = makeScriptUsage({
  description: "Configures the venue access with the selected method and value",
  usageParams:
    "PROJECT_ID VENUE_ID [Password|Emails|Codes] [password | emails file path | codes file path] [CREDENTIAL_PATH]",
  exampleParams:
    "co-reality-map mypartymap Password abc123 [theMatchingAccountServiceKey.json] / co-reality-map mypartymap Emails emails-one-per-line.txt [theMatchingAccountServiceKey.json] / co-reality-map mypartymap Codes ticket-codes-one-per-line.txt [theMatchingAccountServiceKey.json]",
});

const [
  projectId,
  venueId,
  method,
  accessDetail,
  credentialPath,
] = process.argv.slice(2);
if (!projectId || !venueId || !method || !accessDetail) {
  usage();
}

if (!VenueAccessMode[method as keyof typeof VenueAccessMode]) {
  console.error(`Invalid access method ${method}`);
  process.exit(1);
}

initFirebaseAdminApp(projectId, {
  credentialPath: credentialPath
    ? resolve(__dirname, credentialPath)
    : undefined,
});

(async () => {
  console.log(`Ensuring ${venueId} access via ${method} - ${accessDetail}`);
  const venueDoc = await admin.firestore().doc(`venues/${venueId}`).get();
  if (!venueDoc.exists) {
    console.error(`venue ${venueId} does not exist`);
    process.exit(1);
  }

  await admin.firestore().doc(`venues/${venueId}`).update({ access: method });
  console.log("Done");

  console.log(`Configuring access details for ${method}...`);

  const accessDocRef = admin
    .firestore()
    .doc(`venues/${venueId}/access/${method}`);

  switch (method) {
    case VenueAccessMode.Password:
      const password = accessDetail.trim();
      console.log(
        `Setting venues/${venueId}/access/${method} to {password: ${password}}...`
      );
      await accessDocRef.set({ password });
      break;

    case VenueAccessMode.Emails:
      const emails = fs
        .readFileSync(accessDetail, "utf-8")
        .split(/\r?\n/)
        .map((line) => line.trim().toLowerCase());
      console.log(
        `Setting venues/${venueId}/access/${method} to {emails: ${emails}}...`
      );
      await accessDocRef.set(
        {
          emails: admin.firestore.FieldValue.arrayUnion(...emails),
        },
        { merge: true }
      );
      break;

    case VenueAccessMode.Codes:
      const codes = fs
        .readFileSync(accessDetail, "utf-8")
        .split(/\r?\n/)
        .map((line) => line.trim().toLowerCase());

      console.log(`Setting venues/${venueId}/access/${method}...`);
      await accessDocRef.set(
        {
          codes: admin.firestore.FieldValue.arrayUnion(...codes),
        },
        { merge: true }
      );
      break;
  }
  console.log("Done.");

  process.exit(0);
})()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
