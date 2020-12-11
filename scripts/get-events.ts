#!/usr/bin/env node -r esm -r ts-node/register

import admin from "firebase-admin";

import { initFirebaseAdminApp } from "./lib/helpers";

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------  
${scriptName}: Get event details. Prints each event start and end time among other details.

Usage: node ${scriptName} PROJECT_ID

Example: node ${scriptName} co-reality-map
---------------------------------------------------------
`;

  console.log(helpText);
  process.exit(1);
};

const [projectId] = process.argv.slice(2);
if (!projectId) {
  usage();
}

initFirebaseAdminApp(projectId);

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
