#!/usr/bin/env node -r esm -r ts-node/register

import { resolve } from "path";

import fs from "fs";
import admin from "firebase-admin";
import "firebase/firestore";

import { VenueAccessMode } from "../src/types/VenueAcccess";

import { initFirebaseAdminApp, makeScriptUsage } from "./lib/helpers";

const usage = makeScriptUsage({
  description: "Configures the venue access with the selected method and value",
  usageParams: [
    "PROJECT_ID VENUE_ID METHOD ACCESS_DETAIL [CREDENTIAL_PATH]",
    "",
    `PROJECT_ID VENUE_ID ${VenueAccessMode.Password} THE_PASSWORD_TO_SET [CREDENTIAL_PATH]`,
    `PROJECT_ID VENUE_ID ${VenueAccessMode.Emails} LIST_OF_EMAILS_PATH [CREDENTIAL_PATH]`,
    `PROJECT_ID VENUE_ID ${VenueAccessMode.Codes} LIST_OF_ONE_TIME_USE_CODES_PATH [CREDENTIAL_PATH]`,
  ],
  exampleParams: [
    `co-reality-map venue123Id ${VenueAccessMode.Password} secretPassword123 [theMatchingAccountServiceKey.json]`,
    `co-reality-map venue123Id ${VenueAccessMode.Emails} emails-one-per-line.txt [theMatchingAccountServiceKey.json]`,
    `co-reality-map venue123Id ${VenueAccessMode.Codes} one-time-use-ticket-codes-one-per-line.txt [theMatchingAccountServiceKey.json]`,
  ],
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

const venueDocRef = admin.firestore().collection("venues").doc(venueId);
const accessDocRef = venueDocRef.collection("access").doc(method);

(async () => {
  const venueDoc = await venueDocRef.get();

  if (!venueDoc.exists) {
    console.error(`venue '${venueId}' doesn't exist`);
    process.exit(1);
  }

  await admin.firestore().doc(`venues/${venueId}`).update({ access: method });

  console.log(
    `Configuring venue '${venueId}' access mode to use '${method}'...`
  );
  console.log(
    `Configuring venue '${venueId}' access data for '${method}' using '${accessDetail}'...`
  );

  const accessDoc = await accessDocRef.get();
  const access = accessDoc.exists ? accessDoc.data() : {};

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
        `  Adding ${emails.length} email addresses to the '${venueId}' venue's '${method}' whitelist..`
      );
      await accessDocRef.set(
        {
          emails: emails,
        },
        { merge: true }
      );
      break;

    case VenueAccessMode.Codes:
      const codes = fs
        .readFileSync(accessDetail, "utf-8")
        .split(/\r?\n/)
        .forEach((line) => {
          access?.codes?.push(line.trim());
        });
      console.log(`Setting venues/${venueId}/access/${method}...`);
      await accessDocRef.set(
        {
          codes: codes,
        },
        { merge: true }
      );
      break;
  }

  console.log("Finished.");

  process.exit(0);
})()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
