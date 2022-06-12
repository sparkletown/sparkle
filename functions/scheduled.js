const admin = require("firebase-admin");

const functions = require("firebase-functions");

const {
  chunk,
  sampleSize,
  groupBy,
  uniq,
  differenceWith,
  flatten,
  sum,
  has,
} = require("lodash");
const hoursToMilliseconds = require("date-fns/hoursToMilliseconds");

const DEFAULT_RECENT_USERS_IN_VENUE_CHUNK_SIZE = 6;
const SECTION_PREVIEW_USER_DISPLAY_COUNT = 14;
const USER_INACTIVE_THRESHOLD = hoursToMilliseconds(3);
const BATCH_MAX_OPS = 500;

exports.BATCH_MAX_OPS = BATCH_MAX_OPS;

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
          const venueId = seatedUserData.venueId;

          if (!venueId) {
            console.error(
              "No venueId prop in seatedUserData.venueId in" +
                `/venues/MISSING/recentSeatedUsers/${userId}`
            );
            return;
          }

          batch.delete(
            firestore
              .collection("venues")
              .doc(venueId)
              .collection("recentSeatedUsers")
              .doc(userId)
          );
          removedUsersCount += 1;

          switch (seatedUserData.template) {
            case "auditorium":
              if (!has(seatedUserData.venueSpecificData, "sectionId")) {
                console.error(
                  "No sectionId prop in seatedUserData.venueSpecificData in" +
                    `/venues/${venueId}/recentSeatedUsers/${userId}`
                );
                break;
              }
              batch.delete(
                firestore
                  .collection("venues")
                  .doc(venueId)
                  .collection("sections")
                  .doc(seatedUserData.venueSpecificData.sectionId)
                  .collection("seatedSectionUsers")
                  .doc(userId)
              );
              break;
            case "jazzbar":
            case "conversationspace":
              batch.delete(
                firestore
                  .collection("venues")
                  .doc(venueId)
                  .collection("seatedTableUsers")
                  .doc(userId)
              );
              break;
            default:
              console.warn(
                `Found unsupported venue template ${seatedUserData.template}`
              );
              break;
          }
        });
        return batch.commit();
      } catch (e) {
        console.error(e);
        return null;
      }
    })
  ).then(() => console.log(`Removed ${removedUsersCount} dangling users`));
};

const updateSeatedUsersCountInAuditorium = async () => {
  await removeDanglingSeatedUsers();

  const firestore = admin.firestore();
  let updateOccupiedPromises = [{ batch: firestore.batch(), updatesCount: 0 }];

  const { bySectionByAuditorium, allOccupiedSectionIds } = await firestore
    .collectionGroup("seatedSectionUsers")
    .get()
    .then(({ docs }) => {
      const seatedUsers = docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const byAuditorium = groupBy(
        seatedUsers,
        (seatedUser) => seatedUser.path.venueId
      );
      const bySectionByAuditorium = {};
      for (const auditoriumId in byAuditorium) {
        bySectionByAuditorium[auditoriumId] = groupBy(
          byAuditorium[auditoriumId],
          (seatedUser) => seatedUser.path.sectionId
        );
      }

      const allOccupiedSectionIds = uniq(
        seatedUsers.map((u) => u.path.sectionId)
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

      let { batch, updatesCount } = updateOccupiedPromises.pop();
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

exports.updateUsersLocations = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async () => {
    await updateSeatedUsersCountInAuditorium();

    const venuesPromise = admin
      .firestore()
      .collection("venues")
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

    const date3HoursBefore = Date.now() - USER_INACTIVE_THRESHOLD;

    const usersPromise = admin
      .firestore()
      .collection("users")
      .where("lastSeenAt", ">", date3HoursBefore)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
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
            user.lastVenueIdSeenIn && user.lastVenueIdSeenIn.includes(venue.id)
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

exports.updateVenuesChatCounters = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const venueRefs = await admin
      .firestore()
      .collection("venues")
      .get()
      .then(({ docs }) => docs.map((d) => d.ref));

    return Promise.all(
      venueRefs.map(async (venue) => {
        const counter = sum(
          await venue
            .collection("chatMessagesCounter")
            .where(admin.firestore.FieldPath.documentId(), "!=", "sum")
            .get()
            .then(({ docs }) =>
              docs.map((d) => d.data().count).filter((c) => Boolean(c))
            )
        );
        await venue
          .collection("chatMessagesCounter")
          .doc("sum")
          .update({ value: counter });
      })
    );
  });
