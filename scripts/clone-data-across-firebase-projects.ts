#!/usr/bin/env node -r esm -r ts-node/register

import { resolve } from "path";

import { AnyVenue } from "../src/types/Firestore";

import { initFirebaseAdminApp } from "./lib/helpers";

// ---------------------------------------------------------
// Configuration (this is the bit you should edit)
// ---------------------------------------------------------

const SOURCE_PROJECT_ID = "co-reality-map";
const DEST_PROJECT_ID = "co-reality-staging";

const SOURCE_CREDENTIAL_FILE =
  "co-reality-map-firebase-adminsdk-47j7x-530045073b.json";
const DEST_CREDENTIAL_FILE =
  "co-reality-staging-firebase-adminsdk-yy5cq-5fd568c2f4.json";

const SOURCE_DOMAIN = "sparkle.space";
const DEST_DOMAIN = "staging.sparkle.space";

const VENUES_TO_CLONE = ["wayspace"];

// ---------------------------------------------------------
// HERE THERE BE DRAGONS (edit below here at your own risk)
// ---------------------------------------------------------

const CONFIRM_VALUE = "i-have-edited-the-script-and-am-sure";

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------
${scriptName}: Clone venue(s) between different firebase projects

Usage: node ${scriptName} ${CONFIRM_VALUE}

Example: node ${scriptName} ${CONFIRM_VALUE}
---------------------------------------------------------
`;

  console.log(helpText);
  process.exit(1);
};

const [confirmationCheck] = process.argv.slice(2);
if (confirmationCheck !== CONFIRM_VALUE) {
  usage();
}

const sourceApp = initFirebaseAdminApp(SOURCE_PROJECT_ID, {
  appName: "sourceApp",
  credentialPath: resolve(__dirname, SOURCE_CREDENTIAL_FILE),
});

const destApp = initFirebaseAdminApp(DEST_PROJECT_ID, {
  appName: "destApp",
  credentialPath: resolve(__dirname, DEST_CREDENTIAL_FILE),
});

// TODO: do we need to copy roles across?
// TODO: venues (owners will need to be changed)
// TODO: check if venue already exists (be safe, don't overwrite!)

(async () => {
  // TODO: @debt use filters so we are only getting batches of the venues we want, use 'in', _.chunk + Promise.all, etc to page through the data
  const allSourceVenues = await sourceApp
    .firestore()
    .collection("venues")
    .listDocuments();

  const wantedSourceVenues = await Promise.all(
    allSourceVenues
      .filter((venue) => VENUES_TO_CLONE.includes(venue.id))
      .map((venue) =>
        venue.get().then((v) => ({ ...(v.data() as AnyVenue), id: v.id }))
      )
  );

  const replaceSourceDomainReferences = (
    obj: Object,
    key: string,
    objectType: string,
    objectIdentifier: string
  ) => {
    if (obj[key].toString().includes(`//${SOURCE_DOMAIN}`)) {
      const replacementValue = obj[key].replace(
        `//${SOURCE_DOMAIN}`,
        `//${DEST_DOMAIN}`
      );
      console.log(
        `Found a reference to ${SOURCE_DOMAIN} in ${objectType} ${objectIdentifier}, key ${key}.`,
        `Value: ${obj[key]}`,
        `Replacing with: ${replacementValue}`
      );
      obj[key] = replacementValue;
    }
  };

  console.log("total venues:", allSourceVenues.length);
  console.log("wanted venues:", wantedSourceVenues.length, VENUES_TO_CLONE);

  // TODO: we should save backups before we potentially overwrite things..
  // const saveToBackupFile = makeSaveToBackupFile(
  //   `${projectId}-foo`
  // );

  const destAppBatch = destApp.firestore().batch();

  wantedSourceVenues.forEach((venue) => {
    const { id, ...venueData } = venue;
    const destVenueRef = destApp.firestore().collection("venues").doc(id);

    Object.keys(venue).forEach((key) => {
      replaceSourceDomainReferences(venue, key, "venue", venue.id);
    });
    if (venue.rooms) {
      venue.rooms.forEach((room) => {
        Object.keys(room).forEach((key) => {
          replaceSourceDomainReferences(room, key, "room", room.title);
        });
      });
    }

    destAppBatch.set(destVenueRef, venueData);

    console.log("added venue to batch:", venue.name);
  });

  const writeResult = await destAppBatch.commit();
  console.log(writeResult);
})();
