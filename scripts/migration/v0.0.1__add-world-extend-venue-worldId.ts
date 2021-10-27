import { stdin, stdout } from "process";
import readline from "readline";

import { MigrateOptions } from "fireway";

interface FetchSovereignVenueOptions {
  previouslyCheckedVenueIds?: readonly string[];
  maxDepth?: number;
}

interface FetchSovereignVenueReturn {
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

const doMigration = async (firestore: FirebaseFirestore.Firestore) => {
  const venuesCollection = firestore.collection("venues");
  const venueDocs = (await venuesCollection.get()).docs;

  for (const venueDoc of venueDocs) {
    const venueId = venueDoc.id;

    if (venueDoc.data().worldId) {
      const venueWorld = await firestore
        .collection("worlds")
        .doc(venueDoc.data().worldId)
        .get();

      if (venueWorld.exists) {
        console.log(`Skipping ${venueId} as it has already been done`);
        continue;
      }
    }

    try {
      const { sovereignVenue } = await fetchSovereignVenue(venueId, venueDocs);
      const sovereignVenueId = sovereignVenue.id;

      const newWorld = venueDoc.data().worldId
        ? await firestore.collection("worlds").doc(venueDoc.data().worldId)
        : await firestore.collection("worlds").doc();

      newWorld.set({
        ...sovereignVenue.data(),
        slug: sovereignVenueId,
        questions: {
          code: sovereignVenue.data().code_of_conduct_questions ?? [],
          profile: sovereignVenue.data().profile_questions ?? [],
        },
      });

      await venueDoc.ref.update({ worldId: newWorld.id });
    } catch (e) {
      console.error(e);
      console.log(`Failed to migrate venue ${venueId}. Skipping`);
    }
  }
};

export const migrate = async ({ firestore }: MigrateOptions) => {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  await new Promise<void>((resolve, reject) => {
    rl.question(
      "Have you configured algoila as described in the README? [yes|no]",
      async (answer) => {
        if (answer.toLowerCase() !== "yes") {
          reject("Abandoning migration");
          return;
        }

        try {
          await doMigration(firestore);
        } catch (e) {
          console.error(e);
          reject(e);
        }
        resolve();
      }
    );
  });
  rl.close();
};
