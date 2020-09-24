import admin from "firebase-admin";
import serviceAccount from "./prodAccountKey.json";
import "firebase/firestore";

function usage() {
  console.log(`
${process.argv[1]}: Move all hidden venues and venues outside the new map dimensions

Usage: node ${process.argv[1]} PROJECT_ID [DRY_RUN]

Example: node ${process.argv[1]} co-reality-map true
`);
  process.exit(1);
}

const argv = process.argv.slice(2);
if (argv.length < 1) {
  usage();
}

const projectId = argv[0];
const dryRunFlag = argv[1];

if (dryRunFlag && dryRunFlag !== "true") {
  console.error("Dry run flag must be missing, or set to true");
  process.exit(1);
}
const dryRun = dryRunFlag === "true";

admin.initializeApp({
  credential: admin.credential.cert((serviceAccount as unknown) as string),
  databaseURL: `https://${projectId}.firebaseio.com`,
  storageBucket: `${projectId}.appspot.com`,
});

(async () => {
  const firestoreVenues = await admin.firestore().collection("venues").get();
  firestoreVenues.docs.forEach(async (doc) => {
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
  });
})();
