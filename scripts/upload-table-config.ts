#!/usr/bin/env node --experimental-json-modules --loader ts-node/esm

import admin from "firebase-admin";

import { Table } from "../src/types/Table";
import { Venue } from "../src/types/Venue";

import { initFirebaseAdminApp, makeSaveToBackupFile } from "./lib/helpers.js";

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------  
${scriptName}: Upload table config

Usage: node ${scriptName} PROJECT_ID VENUE_ID

Example: node ${scriptName} co-reality-map myvenue
---------------------------------------------------------
`;

  console.log(helpText);
  process.exit(1);
};

const [projectId, venueId] = process.argv.slice(2);
if (!projectId || !venueId) {
  usage();
}

const saveToBackupFile = makeSaveToBackupFile(
  `${projectId}-upload-table-config`
);

initFirebaseAdminApp(projectId);

const generateTables: (props: {
  num: number;
  capacity: number;
  startFrom?: number;
  rows?: number;
  columns?: number;
  titlePrefix?: string;
}) => Table[] = ({
  num,
  capacity,
  startFrom = 0,
  rows = 2,
  columns = 3,
  titlePrefix = "Table",
}) =>
  Array.from(Array(num)).map((_, idx) => {
    const tableNumber = startFrom + 1 + idx;

    return {
      title: `${titlePrefix} ${tableNumber}`,
      reference: `${titlePrefix} ${tableNumber}`,
      capacity,
      rows,
      columns,
    };
  });

const newTables: Table[] = [
  ...generateTables({ num: 5, capacity: 6 }),
  ...generateTables({ num: 5, capacity: 2, startFrom: 5, columns: 2 }),
];

const asSingleTablePerLine = (table: Table) => JSON.stringify(table, null, 0);

(async () => {
  const doc = await admin.firestore().doc(`venues/${venueId}`).get();
  const venue = doc.data() as Venue;
  if (!doc.exists || !venue) {
    console.error(`${venueId} venue does not exist`);
    process.exit(1);
  }

  if (!venue.config) {
    console.error(`${venueId} venue.config does not exist`);
    process.exit(1);
  }

  const oldTables = venue?.config?.tables || [];

  // Show the existing tables data
  console.log("Old Tables:\n", oldTables.map(asSingleTablePerLine));
  console.log("New Tables:\n", newTables.map(asSingleTablePerLine));

  // Save a backup of the current venue config just in case
  saveToBackupFile(venue, `venue-${venueId}`);
  saveToBackupFile(oldTables, `venue-${venueId}-oldTables`);
  saveToBackupFile(newTables, `venue-${venueId}-newTables`);

  venue.config.tables = newTables;
  await admin.firestore().doc(`venues/${venueId}`).set(venue);

  process.exit(0);
})();
