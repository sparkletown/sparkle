import { minutesToMilliseconds } from "date-fns";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {
  chunk,
  differenceWith,
  flatten,
  groupBy,
  sampleSize,
  sum,
  uniq,
} from "lodash";

const DEFAULT_RECENT_USERS_IN_VENUE_CHUNK_SIZE = 6;
const SECTION_PREVIEW_USER_DISPLAY_COUNT = 14;
const USER_INACTIVE_THRESHOLD = minutesToMilliseconds(1);
const USER_PRESENCE_STALE_THRESHOLD = minutesToMilliseconds(2);
const STALE_BOOTH_REMOVAL_THRESHOLD = minutesToMilliseconds(15);
export const BATCH_MAX_OPS = 500;

const removeDanglingSeatedUsers = async () => {
  const firestore = admin.firestore();

  const expiredSittingTimeMs = Date.now() - USER_INACTIVE_THRESHOLD;

  const { docs: recentSeatedUsers } = await firestore
    .collectionGroup("recentSeatedUsers")
    .where("lastSittingTimeMs", "<", expiredSittingTimeMs)
    .get();

  let removedUsersCount = 0;
  return Promise.all(
    chunk(recentSeatedUsers, BATCH_MAX_OPS / 2).map(async (userDocsBatch) => {
      try {
        const batch = firestore.batch();
        userDocsBatch.forEach((userDoc) => {
          const seatedUserData = userDoc.data();
          const userId = userDoc.id;
          const worldId = seatedUserData.worldId;

          if (!worldId) {
            // Delete this record as it is in the old format
            batch.delete(userDoc.ref);
            return;
          }

          batch.delete(
            firestore
              .collection("worlds")
              .doc(worldId)
              .collection("seatedUsers")
              .doc(userId)
          );

          batch.delete(
            firestore
              .collection("worlds")
              .doc(worldId)
              .collection("recentSeatedUsers")
              .doc(userId)
          );
          removedUsersCount += 1;
        });
        return batch.commit();
      } catch (e) {
        console.error(e);
        return null;
      }
    })
  ).then(() => console.log(`Removed ${removedUsersCount} dangling users`));
};

interface SeatedUser {
  id: string;
  worldId: string;
  spaceId: string;
  seatData: {
    sectionId?: string;
  };
}

const updateSeatedUsersCountInAuditorium = async () => {
  await removeDanglingSeatedUsers();

  const firestore = admin.firestore();
  const updateOccupiedPromises = [
    { batch: firestore.batch(), updatesCount: 0 },
  ];

  const { bySectionByAuditorium, allOccupiedSectionIds } = await firestore
    .collectionGroup("seatedUsers")
    .get()
    .then(({ docs }) => {
      const seatedUsers = docs
        .filter((doc) => doc.data().seatData?.sectionId)
        .map((doc) => {
          return { ...doc.data(), id: doc.id } as SeatedUser;
        });

      const byAuditorium = groupBy(
        seatedUsers,
        (seatedUser) => seatedUser.spaceId
      );
      const bySectionByAuditorium: Record<
        string,
        Record<string, SeatedUser[]>
      > = {};
      for (const auditoriumId in byAuditorium) {
        bySectionByAuditorium[auditoriumId] = groupBy(
          byAuditorium[auditoriumId],
          (seatedUser) => seatedUser.seatData?.sectionId
        );
      }

      const allOccupiedSectionIds = uniq(
        seatedUsers.map((u) => u.seatData?.sectionId)
      );

      return { bySectionByAuditorium, allOccupiedSectionIds };
    });

  const { docs: auditoriums } = await admin
    .firestore()
    .collection("venues")
    .where("template", "==", "auditorium")
    .get();

  const allSectionIds = flatten(
    await Promise.all(
      auditoriums.map((auditorium) =>
        auditorium.ref
          .collection("sections")
          .get()
          .then(({ docs: sections }) =>
            sections.map((s) => ({ sectionId: s.id, venueId: auditorium.id }))
          )
      )
    )
  );

  const allEmptySectionIds = differenceWith(
    allSectionIds,
    allOccupiedSectionIds,
    ({ sectionId }, otherSectionId) => sectionId === otherSectionId
  );

  let updateEmptySectionsCount = 0;
  const updateEmptyPromises = chunk(allEmptySectionIds, BATCH_MAX_OPS).map(
    (emptySections) => {
      const batch = firestore.batch();

      emptySections.forEach(({ sectionId, venueId }) => {
        updateEmptySectionsCount += 1;

        batch.update(
          firestore
            .collection("venues")
            .doc(venueId)
            .collection("sections")
            .doc(sectionId),
          {
            seatedUsersCount: 0,
            seatedUsersSample: [],
          }
        );
      });

      return batch.commit();
    }
  );

  let updatedOccupiedSectionsCount = 0;
  Object.entries(bySectionByAuditorium).forEach(([venueId, bySection]) => {
    Object.entries(bySection).forEach(([sectionId, seatedUsers]) => {
      const seatedUsersCount = seatedUsers.length;
      const seatedUsersSample = seatedUsers.splice(
        0,
        SECTION_PREVIEW_USER_DISPLAY_COUNT
      );

      const result = updateOccupiedPromises.pop();
      if (!result) {
        throw new Error("Invalid state");
      }
      let { batch, updatesCount } = result;
      if (updatesCount === BATCH_MAX_OPS) {
        updateOccupiedPromises.push({ batch, updatesCount });

        batch = firestore.batch();
        updatesCount = 0;
      }

      updateOccupiedPromises.push({ batch, updatesCount: updatesCount + 1 });

      updatedOccupiedSectionsCount += 1;
      batch.update(
        firestore
          .collection("venues")
          .doc(venueId)
          .collection("sections")
          .doc(sectionId),
        {
          seatedUsersCount,
          seatedUsersSample,
        }
      );
    });
  });

  console.log(
    `Updated ${updatedOccupiedSectionsCount} occupied sections and ${updateEmptySectionsCount} empty sections`
  );

  return await Promise.all([
    updateOccupiedPromises.map(({ batch }) => batch.commit()),
    ...updateEmptyPromises,
  ]);
};

interface User {
  id: string;
  lastVenueIdSeenIn: string;
}

interface Venue {
  id: string;
  recentUsersSampleSize: number;
}

export const updateUsersLocations = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async () => {
    await updateSeatedUsersCountInAuditorium();

    const venuesPromise = admin
      .firestore()
      .collection("venues")
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Venue))
      );

    const date3HoursBefore = Date.now() - USER_INACTIVE_THRESHOLD;

    const usersPromise = admin
      .firestore()
      .collection("users")
      .where("lastSeenAt", ">", date3HoursBefore)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as User))
      );

    const [recentUsers, venues] = await Promise.all([
      usersPromise,
      venuesPromise,
    ]);

    // NOTE: Chunk users into batch commit to fasten the operation
    return chunk(venues, BATCH_MAX_OPS).map((venuesChunk) => {
      const batch = admin.firestore().batch();

      for (const venue of venuesChunk) {
        const recentVenueUsers = recentUsers.filter(
          (user) =>
            user.lastVenueIdSeenIn && user.lastVenueIdSeenIn === venue.id
        );

        const recentVenueUsersCount = recentVenueUsers.length;

        const venueRef = admin.firestore().collection("venues").doc(venue.id);

        batch.update(venueRef, {
          recentUserCount: recentVenueUsersCount,
          recentUsersSample: sampleSize(
            recentVenueUsers,
            venue.recentUsersSampleSize ||
              DEFAULT_RECENT_USERS_IN_VENUE_CHUNK_SIZE
          ),
        });
      }

      return batch.commit();
    });
  });

export const updateVenuesChatCounters = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const venueRefs = await admin
      .firestore()
      .collection("venues")
      .get()
      .then(({ docs }) => docs.map((d) => d.ref));

    return Promise.all(
      venueRefs.map(async (venue) => {
        const subcounters = await venue
          .collection("chatMessagesCounter")
          .where(admin.firestore.FieldPath.documentId(), "!=", "sum")
          .get();
        // If there aren't any subcounters then skip this space
        if (!subcounters.docs.length) return;
        const counter = sum(
          subcounters.docs.map((d) => d.data().count).filter((c) => Boolean(c))
        );
        await venue
          .collection("chatMessagesCounter")
          .doc("sum")
          .update({ value: counter });
      })
    );
  });

/*
 * Removes stale presence records and then updates the cache of counts for each
 * space
 */
export const updatePresenceRecords = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async () => {
    const firestore = admin.firestore();

    const expiredSittingTimeMs = Date.now() - USER_PRESENCE_STALE_THRESHOLD;

    const { docs } = await firestore
      .collection("userPresence")
      .where("lastSeenAt", "<", expiredSittingTimeMs)
      .get();

    let removedCount = 0;
    await Promise.all(
      chunk(docs, BATCH_MAX_OPS / 2).map(async (docsBatch) => {
        try {
          const batch = firestore.batch();
          docsBatch.forEach((userDoc) => {
            batch.delete(userDoc.ref);
            removedCount += 1;
          });
          return batch.commit();
        } catch (e) {
          console.error(e);
          return null;
        }
      })
    ).then(() =>
      console.log(`Removed ${removedCount} dangling presence records`)
    );

    const spaceRefs = await admin
      .firestore()
      .collection("venues")
      .get()
      .then(({ docs }) => docs.map((d) => d.ref));

    return Promise.all(
      spaceRefs.map(async (space) => {
        const presenceDocs = await admin
          .firestore()
          .collection("userPresence")
          .where("spaceId", "==", space.id)
          .get();

        // If there aren't any subcounters then skip this space
        await space.update({
          presentUserCachedCount: presenceDocs.docs.length,
        });
      })
    ).then(() => console.log(`Recached ${spaceRefs.length} presence counts`));
  });

/*
 * Removes stale booths.
 */
export const removeStaleBooths = functions.pubsub
  .schedule(`every 5 minutes`)
  .onRun(async () => {
    const spaces = await admin
      .firestore()
      .collection("venues")
      .where("managedBy", "!=", "")
      .where("template", "==", "meetingroom")
      .where("isHidden", "==", false)
      .get();

    let reoccupiedCount = 0;
    let deletedCount = 0;
    let emptyCount = 0;

    return Promise.all(
      spaces.docs.map(async (spaceDoc) => {
        let update = {};
        const space = spaceDoc.data();
        if (space.presentUserCachedCount > 0) {
          if (space.emptySince) {
            // Wipe the tracker as the booth has become occupied
            update = { emptySince: null };
            reoccupiedCount++;
          }
        } else {
          const emptySinceThreshold =
            Date.now() - STALE_BOOTH_REMOVAL_THRESHOLD;
          if (
            space.emptySince &&
            space.emptySince < emptySinceThreshold &&
            !space.isHidden
          ) {
            update = { isHidden: true };
            deletedCount++;
          } else if (!space.emptySince) {
            update = { emptySince: Date.now() };
            emptyCount++;
          }
        }

        if (Object.keys(update).length !== 0) {
          await spaceDoc.ref.update(update);
        }
      })
    ).then(() =>
      console.log(
        `${spaces.docs.length} spaces checked for staleness. ` +
          `${reoccupiedCount} reoccupied. ` +
          `${deletedCount} marked as deleted. ` +
          `${emptyCount} found empty and counted. `
      )
    );
  });
