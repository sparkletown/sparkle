import admin from "firebase-admin";
import serviceAccount from "./prodAccountKey.json";
import "firebase/firestore";
import { Table } from "../src/types/Table";

const generateTables: (props: {
  num: number;
  capacity: number;
  startFrom?: number;
  cols?: number;
}) => Table[] = ({ num, capacity, startFrom, cols }) =>
  Array.from(Array(num)).map((_, idx) => ({
    capacity,
    title: `Table ${idx + (startFrom ?? 0) + 1}`,
    reference: `Table ${idx + (startFrom ?? 0) + 1}`,
    rows: 2,
    columns: cols ?? 3,
  }));

const TABLES: Table[] = [
  ...generateTables({ num: 5, capacity: 6 }),
  ...generateTables({ num: 5, capacity: 2, startFrom: 5, cols: 2 }),
];

function usage() {
  console.log(`
${process.argv[1]}: Upload table config

Usage: node ${process.argv[1]} PROJECT_ID VENUE_ID

Example: node ${process.argv[1]} co-reality-map myvenue
`);
  process.exit(1);
}

const argv = process.argv.slice(2);
if (argv.length < 1) {
  usage();
}

const projectId = argv[0];
const venueId = argv[1];

admin.initializeApp({
  credential: admin.credential.cert((serviceAccount as unknown) as string),
  databaseURL: `https://${projectId}.firebaseio.com`,
  storageBucket: `${projectId}.appspot.com`,
});

(async () => {
  const doc = await admin.firestore().doc(`venues/${venueId}`).get();
  if (!doc.exists) {
    console.error("doc does not exist");
    process.exit(1);
  }
  const venue = doc.data();

  console.log(`venue ${venueId} in project ${projectId}:`);
  console.log(venue);

  venue.config.tables = TABLES;
  await admin.firestore().doc(`venues/${venueId}`).set(venue);

  process.exit(0);
})();
