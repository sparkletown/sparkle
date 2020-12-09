import fs from "fs";
import admin from "firebase-admin";
import serviceAccount from "./prodAccountKey.json";
import "firebase/firestore";
import { Venue } from "../src/types/Venue";
import {
  VenueAccessCodes,
  VenueAccessEmails,
  VenueAccessPassword,
  VenueAccessType,
} from "../src/types/VenueAcccess";

const mergeStringArrays = (
  arr1: string[] | undefined,
  arr2: string[] | undefined
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

Usage: npx ts-node ${process.argv[1]} PROJECT_ID VENUE_ID [password|emails|codes] [password | emails file path | codes file path]

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
const accessMode = argv[2] as VenueAccessType;
const accessDetail = argv[3];

admin.initializeApp({
  credential: admin.credential.cert((serviceAccount as unknown) as string),
  databaseURL: `https://${projectId}.firebaseio.com`,
  storageBucket: `${projectId}.appspot.com`,
});

(async () => {
  console.log(`Ensuring ${venueId} access via ${accessMode} - ${accessDetail}`);
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
  if (!venue.access.includes(accessMode)) {
    venue.access.push(accessMode);
  }
  console.log(`Setting venues/${venueId} access to ${venue.access}...`);
  await admin.firestore().doc(`venues/${venueId}`).set(venue);
  console.log("Done");

  console.log(`Configuring access details for ${accessMode}...`);
  const accessDoc = await admin
    .firestore()
    .doc(`venues/${venueId}/${accessMode}`)
    .get();
  const access = accessDoc.exists ? accessDoc : {};

  switch (accessMode) {
    case VenueAccessType.Password:
      (access as VenueAccessPassword).password = accessDetail;
      break;

    case VenueAccessType.EmailList:
      const emails = [];
      fs.readFileSync(accessDetail, "utf-8")
        .split(/\r?\n/)
        .forEach(function (line) {
          emails.push(line);
        });
      (access as VenueAccessEmails).emails = mergeStringArrays(
        (access as VenueAccessEmails).emails,
        emails
      );
      break;

    case VenueAccessType.CodeList:
      const codes = [];
      fs.readFileSync(accessDetail, "utf-8")
        .split(/\r?\n/)
        .forEach(function (line) {
          emails.push(line);
        });
      (access as VenueAccessCodes).codes = codes;
      break;
  }
  console.log(`Setting venues/${venueId}/${accessMode} to ${access}...`);
  await admin.firestore().doc(`venues/${venueId}/${accessMode}`).set(access);
  console.log("Done.");

  process.exit(0);
})();
