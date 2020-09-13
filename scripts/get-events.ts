import admin from "firebase-admin";
import serviceAccount from "./prodAccountKey.json";
import "firebase/firestore";

function usage() {
  console.log(`
${process.argv[1]}: Get event details. Prints each event start and end time among other details.

Usage: node ${process.argv[1]} PROJECT_ID

Example: node ${process.argv[1]} co-reality-map
`);
  process.exit(1);
}

const argv = process.argv.slice(2);
if (argv.length < 1) {
  usage();
}

const projectId = argv[0];

admin.initializeApp({
  credential: admin.credential.cert((serviceAccount as unknown) as string),
  databaseURL: `https://${projectId}.firebaseio.com`,
  storageBucket: `${projectId}.appspot.com`,
});

(async () => {
  console.log(
    [
      "Venue ID",
      "Venue Name",
      "Event Name",
      "Event Host",
      "Event Description",
      "Room",
      "Start Time",
      "Duration (Days)",
      "End Time",
    ]
      .map((heading) => `"${heading}"`)
      .join(",")
  );
  const firestoreVenues = await admin.firestore().collection("venues").get();
  firestoreVenues.docs.forEach((doc) => {
    (async () => {
      const venueId = doc.id;
      const venueName = doc.data().name;
      const events = await admin
        .firestore()
        .collection("venues")
        .doc(venueId)
        .collection("events")
        .get();
      events.forEach((eventDoc) => {
        const eventName = eventDoc.data().name;
        const eventHost = eventDoc.data().host;
        const eventDescription = eventDoc.data().description;
        const eventRoom = eventDoc.data().room;
        const startTime = new Date(
          eventDoc.data().start_utc_seconds * 1000
        ).getTime();
        const durationMinutes = eventDoc.data().duration_minutes;
        const durationDays = durationMinutes / (60 * 24);
        const endTime = startTime + durationMinutes * 60 * 1000;

        console.log(
          [
            venueId,
            venueName,
            eventName,
            eventHost,
            eventDescription,
            eventRoom,
            new Date(startTime).toISOString(),
            durationDays,
            new Date(endTime).toISOString(),
          ]
            .map(
              (v) =>
                `"${(v ?? "")
                  .toString()
                  .split('"')
                  .join('\\"')
                  .split(",")
                  .join("\\,")
                  .split("\n")
                  .join(" ")}"`
            )
            .join(",")
        );
      });
    })();
  });
})();
