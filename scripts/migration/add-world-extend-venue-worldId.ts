#!/usr/bin/env node -r esm -r ts-node/register

import { resolve } from "path";

import admin from "firebase-admin";
import { chunk } from "lodash";

import { initFirebaseAdminApp, makeScriptUsage } from "../lib/helpers";

const usage = makeScriptUsage({
  description: "Update events details: { venueId, sovereignVenueId }",
  usageParams: "PROJECT_ID [CREDENTIAL_PATH]",
  exampleParams: "co-reality-map [theMatchingAccountServiceKey.json]",
});

const [projectId, credentialPath] = process.argv.slice(2);

// Note: no need to check credentialPath here as initFirebaseAdmin defaults it when undefined
if (!projectId) {
  usage();
}

initFirebaseAdminApp(projectId, {
  credentialPath: credentialPath ? resolve(credentialPath) : undefined,
});

export interface FetchSovereignVenueOptions {
  previouslyCheckedVenueIds?: readonly string[];
  maxDepth?: number;
}

export interface FetchSovereignVenueReturn {
  sovereignVenue: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>;
  checkedVenueIds: readonly string[];
}

const fetchSovereignVenue = async (
  venueId: string,
  venues: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[],
  options?: FetchSovereignVenueOptions
): Promise<FetchSovereignVenueReturn> => {
  const { previouslyCheckedVenueIds = [], maxDepth } = options ?? {};

  const venue = venues.find((venue) => venue.id === venueId);

  if (!venue) throw new Error(`The '${venueId}' venue doesn't exist`);

  if (!venue.data().parentId)
    return {
      sovereignVenue: venue,
      checkedVenueIds: previouslyCheckedVenueIds,
    };

  if (previouslyCheckedVenueIds.includes(venueId))
    throw new Error(
      `Circular reference detected. '${venueId}' has already been checked`
    );

  if (maxDepth && maxDepth <= 0)
    throw new Error("Maximum depth reached before finding the sovereignVenue.");

  return fetchSovereignVenue(venue.data().parentId, venues, {
    ...options,
    previouslyCheckedVenueIds: [...previouslyCheckedVenueIds, venueId],
    maxDepth: maxDepth ? maxDepth - 1 : undefined,
  });
};

(async () => {
  const venuesCollection = admin.firestore().collection("venues");
  const venueDocs = (await venuesCollection.get()).docs;

  // const batch = admin.firestore().batch();
  chunk(venueDocs, 100).forEach(async (venueDocsChunk) => {
    venueDocsChunk.forEach(async (venueDoc) => {
      const venueId = venueDoc.id;
      const { sovereignVenue } = await fetchSovereignVenue(venueId, venueDocs);
      const sovereignVenueId = sovereignVenue.id;

      await admin
        .firestore()
        .collection("worlds")
        .doc(sovereignVenueId)
        .set(sovereignVenue.data());

      await venueDoc.ref.update({ worldId: sovereignVenueId });
    });
  });

  // await batch.commit().catch((error) => {
  //   throw new Error(
  //     `Commit batch of recent users of venues failed. Error: ${error}`
  //   );
  // });
})();
