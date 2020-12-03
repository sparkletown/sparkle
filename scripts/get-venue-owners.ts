import admin from "firebase-admin";
import serviceAccount from "./prodAccountKey.json";
import "firebase/firestore";

function usage() {
  console.log(`
${process.argv[1]}: Print venue owners' email addresses

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
  const { users, pageToken } = await admin.auth().listUsers(1000);
  
  const allUsers = [...users];
  let nextPageToken = pageToken;
  
  while (nextPageToken) {
    const { users, pageToken } = await admin
      .auth()
      .listUsers(1000, nextPageToken);
    allUsers.push(...users);
    nextPageToken = pageToken;
  }

  const firestoreVenues = await admin.firestore().collection("venues").get();
  const venues = firestoreVenues.docs.filter(
    (doc) =>
      doc.exists &&
      (doc.id === venueId ||
        (doc.data().parentId && doc.data().parentId === venueId))
  );
  venues.forEach((doc) => {
    if (!doc.exists) return;

    // For all venues, print venue id and owners
    console.log(
      `Venue: ${doc.id} (${doc.data().name}) is owned by emails: ${doc
        .data()
        .owners.map((uid) => allUsers.find((u) => u.uid === uid)?.email ?? uid)
        .join(", ")}`
    );
  });

  process.exit(0);
})();
