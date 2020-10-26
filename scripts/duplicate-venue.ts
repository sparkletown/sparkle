import admin from "firebase-admin";
import serviceAccount from "./prodAccountKey.json";
import "firebase/firestore";

function usage() {
  console.log(`
${process.argv[1]}: Get venue details. Prints venue name, type and other details.

Usage: node ${process.argv[1]} PROJECT_ID VENUE_ID TARGET_VENUE_ID

Example: node ${process.argv[1]} co-reality-staging myspanishroom myenglishroom
`);
  process.exit(1);
}

const argv = process.argv.slice(2);
if (argv.length < 1) {
  usage();
}

const projectId = argv[0];
const sourceVenueId = argv[1];
const destVenueId = argv[2];

admin.initializeApp({
  credential: admin.credential.cert((serviceAccount as unknown) as string),
  databaseURL: `https://${projectId}.firebaseio.com`,
  storageBucket: `${projectId}.appspot.com`,
});

(async () => {
  const sourceVenue = await admin
    .firestore()
    .doc(`venues/${sourceVenueId}`)
    .get();
  if (!sourceVenue.exists) {
    console.error(`Venue ${sourceVenueId} does not exist; exiting`);
    process.exit(1);
  }
  console.log(`Got venue ${sourceVenueId}`);
  console.log(`Writing to ${destVenueId}...`);
  await admin
    .firestore()
    .doc(`venues/${destVenueId}`)
    .set(sourceVenue.data() ?? {});
  console.log("Done");
  process.exit(0);
})();
