import admin from "firebase-admin";
import serviceAccount from "./prodAccountKey.json";
import "firebase/firestore";

const TABLES = [
  {
    capacity: 14,
    title: "Table 1",
    reference: "jazzbar-table-1",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 2",
    reference: "jazzbar-table-2",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 3",
    reference: "jazzbar-table-3",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 4",
    reference: "jazzbar-table-4",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 5",
    reference: "jazzbar-table-5",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 6",
    reference: "jazzbar-table-6",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 7",
    reference: "jazzbar-table-7",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 8",
    reference: "jazzbar-table-8",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 9",
    reference: "jazzbar-table-9",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 10",
    reference: "jazzbar-table-10",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 11",
    reference: "jazzbar-table-11",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 12",
    reference: "jazzbar-table-12",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 13",
    reference: "jazzbar-table-13",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 14",
    reference: "jazzbar-table-14",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 15",
    reference: "jazzbar-table-15",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 16",
    reference: "jazzbar-table-16",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 17",
    reference: "jazzbar-table-17",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 18",
    reference: "jazzbar-table-18",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 19",
    reference: "jazzbar-table-19",
    rows: 2,
    columns: 7,
  },
  {
    capacity: 14,
    title: "Table 20",
    reference: "jazzbar-table-20",
    rows: 2,
    columns: 7,
  },
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
