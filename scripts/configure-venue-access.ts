#!/usr/bin/env node -r esm -r ts-node/register

import fs from "fs";
import admin from "firebase-admin";
import "firebase/firestore";

import {
  VenueAccessCodes,
  VenueAccessEmails,
  VenueAccessMode,
} from "../src/types/VenueAcccess";

import { initFirebaseAdminApp } from "./lib/helpers";

const mergeStringArrays = (
  arr1: string[] = [],
  arr2: string[] = []
): string[] => {
  const result = arr1.map((val) => val.trim());
  arr2.forEach((val) => {
    const valTrimmed = val.trim();
    if (!result.includes(valTrimmed)) {
      result.push(valTrimmed);
    }
  });
  return result;
};

function usage() {
  console.log(`
${process.argv[1]}: Configure venue access. Supports configuring a secret password, list of emails which can access the venue, or ticket codes.

Usage: npx ts-node ${process.argv[1]} PROJECT_ID VENUE_ID [password|emaillist|codelist] [password | emails file path | codes file path]

Example: npx ts-node ${process.argv[1]} co-reality-map password abc123
Example: npx ts-node ${process.argv[1]} co-reality-map emails emails-one-per-line.txt
Example: npx ts-node ${process.argv[1]} co-reality-map codes ticket-codes-one-per-line.txt
`);
  process.exit(1);
}

const argv = process.argv.slice(2);
if (argv.length < 4) {
  usage();
}

const projectId = argv[0];
const venueId = argv[1];
const method = argv[2];
const accessDetail = argv[3];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(Object as any).values(VenueAccessMode).includes(method)) {
  console.error(`Invalid access method ${method}`);
  process.exit(1);
}

initFirebaseAdminApp(projectId)(async () => {
  console.log(`Ensuring ${venueId} access via ${method} - ${accessDetail}`);
  const venueDoc = await admin.firestore().doc(`venues/${venueId}`).get();
  if (!venueDoc.exists) {
    console.error(`venue ${venueId} does not exist`);
    process.exit(1);
  }

  await admin
    .firestore()
    .doc(`venues/${venueId}`)
    .update({ access: method ?? "" });
  console.log("Done");

  console.log(`Configuring access details for ${method}...`);
  const accessDoc = await admin
    .firestore()
    .doc(`venues/${venueId}/access/${method}`)
    .get();
  const access = accessDoc.exists ? accessDoc.data() : {};

  switch (method) {
    case VenueAccessMode.Password:
      console.log(
        `Setting venues/${venueId}/access/${method} to {password: ${accessDetail.trim()}}...`
      );
      await admin
        .firestore()
        .doc(`venues/${venueId}/access/${method}`)
        .set({ password: accessDetail.trim() });
      break;

    case VenueAccessMode.Emails:
      const emails = fs
        .readFileSync(accessDetail, "utf-8")
        .split(/\r?\n/)
        .map((line) => line.trim().toLowerCase());
      console.log(
        `Setting venues/${venueId}/access/${method} to {emails: ${emails}}...`
      );
      await admin
        .firestore()
        .doc(`venues/${venueId}/access/${method}`)
        .set({
          emails: mergeStringArrays(
            emails,
            (access as VenueAccessEmails).emails
          ),
        });
      break;

    case VenueAccessMode.Codes:
      fs.readFileSync(accessDetail, "utf-8")
        .split(/\r?\n/)
        .forEach((line) => {
          emails.push(line.trim());
        });
      console.log(`Setting venues/${venueId}/access/${method}...`);
      await admin
        .firestore()
        .doc(`venues/${venueId}/access/${method}`)
        .set({
          codes: (access as VenueAccessCodes).codes,
        });
      break;
  }
  console.log("Done.");

  process.exit(0);
})();
