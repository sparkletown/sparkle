#!/usr/bin/env node -r esm -r ts-node/register

import admin from "firebase-admin";

import { initFirebaseAdminApp } from "./lib/helpers";

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------  
${scriptName}: Move all hidden venues and venues outside the new map dimensions

Usage: node ${scriptName} PROJECT_ID [DRY_RUN]

Example: node ${scriptName} co-reality-map true
---------------------------------------------------------
`;

  console.log(helpText);
  process.exit(1);
};

const [projectId, dryRunFlag] = process.argv.slice(2);
if (!projectId) {
  usage();
}

if (dryRunFlag && dryRunFlag !== "true") {
  console.error("Dry run flag must be missing, or set to true");
  process.exit(1);
}
const dryRun = dryRunFlag === "true";

initFirebaseAdminApp(projectId);

(async () => {
  const firestoreVenues = await admin.firestore().collection("venues").get();

  for (const doc of firestoreVenues.docs) {
    const venueId = doc.id;
    const placement = doc.data().placement;

    if (!placement) {
      console.log(`skipping venue ${venueId} as it has no placement info`);
    } else {
      console.log(`venue ${venueId}:`, placement);
      let processThisVenue = false;

      if (placement.state === "HIDDEN") {
        console.log("venue is HIDDEN, we will rescale its placement.");
        processThisVenue = true;
      }

      if (placement.x > 2000 || placement.y > 2000) {
        console.log(
          `venue placement state is ${placement.state}, not hidden, but it is out of bounds; we will rescale its placement`
        );
        processThisVenue = true;
      }

      if (!processThisVenue) {
        console.log(`venue does not meet criteria for rescaling; skipping`);
      } else {
        const newPlacement = { ...placement };
        newPlacement.x = placement.x / 2;
        newPlacement.y = placement.y / 2;

        console.log(
          `${
            dryRun ? "DRY RUN, NO UPDATE: " : ""
          }updating placement for ${venueId} to`,
          newPlacement
        );

        if (!dryRun) {
          await admin
            .firestore()
            .doc(`venues/${venueId}`)
            .update({ placement: newPlacement });
        }
      }
    }
  }
})();
