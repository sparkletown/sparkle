const admin = require("firebase-admin");

const functions = require("firebase-functions");

const { chunk, sampleSize, groupBy } = require("lodash");
const hoursToMilliseconds = require("date-fns/hoursToMilliseconds");

const DEFAULT_RECENT_USERS_IN_VENUE_CHUNK_SIZE = 6;
const SECTION_PREVIEW_USER_DISPLAY_COUNT = 14;
const VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL = 60 * 1000;
const BATCH_MAX_OPS = 500;

const removeDanglingSeatedUsers = async () => {
  const firestore = admin.firestore();

  const expiredSittingTimeMs =
    Date.now() - VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL;

  const { docs: recentSeatedUsers } = await firestore
    .collectionGroup("recentSeatedUsers")
    .where("lastSittingTimeMs", "<", expiredSittingTimeMs)
    .get();

  let removedUsersCount = 0;
  return Promise.all(
    chunk(recentSeatedUsers, BATCH_MAX_OPS / 2).map((userDocsBatch) => {
      const batch = firestore.batch();
      userDocsBatch.forEach((userDoc) => {
        const seatedUserData = userDoc.data();
        const userId = userDoc.id;
        const venueId = seatedUserData.venueId;

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
          case "friendship":
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
    })
  ).then(() => console.log(`Removed ${removedUsersCount} dangling users`));
};

exports.updateSeatedUsersCountInAuditorium = functions.https.onCall(
  async () => {
    // functions.pubsub
    // .schedule("every 5 minutes")
    // .onRun(async () => {
    await removeDanglingSeatedUsers();

    const firestore = admin.firestore();
    let batches = [{ batch: firestore.batch(), updatesCount: 0 }];

    const bySectionByAuditorium = await firestore
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

        return bySectionByAuditorium;
      });

    let updatedSectionsCount = 0;
    Object.entries(bySectionByAuditorium).forEach(([venueId, bySection]) => {
      Object.entries(bySection).forEach(([sectionId, seatedUsers]) => {
        console.log(
          `/venues/${venueId}/sections/${sectionId}/seatedSectionUsers length ${seatedUsers.length}`
        );
        const seatedUsersCount = seatedUsers.length;
        const seatedUsersSample = seatedUsers.splice(
          0,
          SECTION_PREVIEW_USER_DISPLAY_COUNT
        );

        let { batch, updatesCount } = batches.pop();
        if (updatesCount === BATCH_MAX_OPS) {
          batches.push({ batch, updatesCount });

          batch = firestore.batch();
          updatesCount = 0;
        }

        batches.push({ batch, updatesCount: updatesCount + 1 });

        updatedSectionsCount += 1;
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

    console.log(`Updated ${updatedSectionsCount} sections`);
    return await Promise.all(batches.map(({ batch }) => batch.commit()));
  }
);

exports.aggregateUsersLocationsInVenue = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const venuesPromise = admin
      .firestore()
      .collection("venues")
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

    const date3HoursBefore = Date.now() - hoursToMilliseconds(3);

    const usersPromise = admin
      .firestore()
      .collection("users")
      .where("lastSeenAt", ">", date3HoursBefore)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

    const [users, venues] = await Promise.all([usersPromise, venuesPromise]);

    // NOTE: Chunk users into batch commit to fasten the operation
    return chunk(venues, BATCH_MAX_OPS).map((venuesChunk) => {
      const batch = admin.firestore().batch();

      for (const venue of venuesChunk) {
        const recentVenueUsers = users.filter(
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
