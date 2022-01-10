#!/usr/bin/env node -r esm -r ts-node/register

// Move events to their own top-level collection and tidy up some of the fields
// along the way.

import { MigrateOptions } from "fireway";
import omit from "lodash/omit";

export const migrate = async ({ firestore }: MigrateOptions) => {
  console.log(`Updating events...`);

  const { docs: venueDocs } = await firestore.collection("venues").get();

  for (const venueDoc of venueDocs) {
    const { docs: eventDocs } = await venueDoc.ref.collection("events").get();
    
    if (!eventDocs.length) continue;
    
    console.log(`Space ${venueDoc.id} has ${eventDocs.length} events`);
    
    for (const eventDoc of eventDocs) {
      const oldEventData = eventDoc.data();
      const newEventData = {
        ...omit(
          oldEventData,
          "start_utc_seconds",
          "room",
          "descriptions",
          "duration_minutes"
        ),
      };
      newEventData.startUtcSeconds = oldEventData.start_utc_seconds;
      newEventData.durationMinutes = oldEventData.duration_minutes;
      await firestore.collection("worldEvents").add(newEventData);
    }
  }

  console.log("Finished successfully.");
};
