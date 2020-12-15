import fs from "fs";
import admin from "firebase-admin";
import serviceAccount from "./prodAccountKey.json";
import "firebase/firestore";
import { Venue } from "../src/types/Venue";
import {
  VenueAccessCodes,
  VenueAccessEmails,
  VenueAccessType,
} from "../src/types/VenueAcccess";

const mergeStringArrays = (
  arr1: string[] = [],
  arr2: string[] = []
): string[] => {
  const result = (arr1 ?? []).map((val) => val.trim());
  (arr2 ?? []).forEach((val) => {
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

const [projectId, venueId, method, accessDetail] = argv;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(Object as any).values(VenueAccessType).includes(method)) {
  console.error(`Invalid access method ${method}`);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert((serviceAccount as unknown) as string),
  databaseURL: `https://${projectId}.firebaseio.com`,
  storageBucket: `${projectId}.appspot.com`,
});

(async () => {
  console.log(`Ensuring ${venueId} access via ${method} - ${accessDetail}`);
  const venueDoc = await admin.firestore().doc(`venues/${venueId}`).get();
  if (!venueDoc.exists) {
    console.error(`venue ${venueId} does not exist`);
    process.exit(1);
  }
  const venue = venueDoc.data() as Venue;

  console.log(`venue ${venueId} in project ${projectId}:`);
  console.log(venue);

  if (!venue.access) {
    venue.access = [];
  }
  console.log(`Previous access methods: ${venue.access}`);
  if (!venue.access.includes(method as VenueAccessType)) {
    venue.access.push(method as VenueAccessType);
  }
  console.log(`Setting venues/${venueId} access to ${venue.access}...`);
  await admin.firestore().doc(`venues/${venueId}`).set(venue);
  console.log("Done");

  console.log(`Configuring access details for ${method}...`);
  const accessDoc = await admin
    .firestore()
    .doc(`venues/${venueId}/access/${method}`)
    .get();
  const access = accessDoc.exists ? accessDoc.data() : {};

  switch (method) {
    case VenueAccessType.Password:
      console.log(
        `Setting venues/${venueId}/access/${method} to {password: ${accessDetail.trim()}}...`
      );
      await admin
        .firestore()
        .doc(`venues/${venueId}/access/${method}`)
        .set({ password: accessDetail.trim() });
      break;

    case VenueAccessType.Emails:
      const emails = [];
      fs.readFileSync(accessDetail, "utf-8")
        .split(/\r?\n/)
        .forEach((line) => {
          emails.push(line.trim().toLowerCase());
        });
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

    case VenueAccessType.Codes:
      const codes = [];
      fs.readFileSync(accessDetail, "utf-8")
        .split(/\r?\n/)
        .forEach((line) => {
          emails.push(line.trim());
        });
      console.log(
        `Setting venues/${venueId}/access/${method} to {codes: ${codes}}...`
      );
      await admin
        .firestore()
        .doc(`venues/${venueId}/access/${method}`)
        .set({
          codes: mergeStringArrays(codes, (access as VenueAccessCodes).codes),
        });
      break;
  }
  console.log("Done.");

  process.exit(0);
})();
