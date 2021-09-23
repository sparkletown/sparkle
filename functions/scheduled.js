const admin = require("firebase-admin");

const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");

const { chunk, sampleSize, groupBy } = require("lodash");
const hoursToMilliseconds = require("date-fns/hoursToMilliseconds");

const DEFAULT_RECENT_USERS_IN_VENUE_CHUNK_SIZE = 6;
const SECTION_PREVIEW_USER_DISPLAY_COUNT = 14;
const VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL = 5000;

const removeDanglingSeatedUsers = async () => {
  const firestore = admin.firestore();
  const batch = firestore.batch();

  const expiredSittingTimeMs =
    Date.now() - VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL;

  const { docs: recentSeatedUsers } = await firestore
    .collectionGroup("recentSeatedUsers")
    .where("lastSittingTimeMs", "<", expiredSittingTimeMs)
    .get();

  recentSeatedUsers.forEach((userDoc) => {
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
    console.log(
      "[scheduled-updateSeatedUsersCountInAuditorium] " +
        `Deleted /venues/${venueId}/recentSeatedUsers/${userId}`
    );

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
        console.log(
          "[scheduled-updateSeatedUsersCountInAuditorium] " +
            `Deleted from ${seatedUserData.template} /venues/${venueId}/sections/` +
            `${seatedUserData.venueSpecificData.sectionId}/seatedSectionUsers/${userId}`
        );
        break;
      default:
        console.warn(
          `Found unsupported venue template ${seatedUserData.template}`
        );
        break;
    }
  });

  await batch.commit();
};

exports.updateSeatedUsersCountInAuditorium = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const firestore = admin.firestore();
    const batch = firestore.batch();

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

    Object.entries(bySectionByAuditorium).forEach(([venueId, bySection]) => {
      Object.entries(bySection).forEach(([sectionId, seatedUsers]) => {
        if (seatedUsers.length <= 0) return;

        const seatedUsersCount = seatedUsers.length;
        const seatedUsersSample = seatedUsers.splice(
          0,
          SECTION_PREVIEW_USER_DISPLAY_COUNT
        );

        console.log(
          `[scheduled-updateSeatedUsersCountInAuditorium] /venues/${venueId}/sections/${sectionId}:`
        );
        console.log(
          `{\n\tseatedUsersCount: ${seatedUsersCount},\n\tseatedUsersSample: ${seatedUsersSample.map(
            (u) => u.id
          )}\n}`
        );
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

    await batch.commit();
    return await removeDanglingSeatedUsers();
  });

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
    chunk(venues, 250).forEach((venuesChunk) => {
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

      batch.commit().catch((error) => {
        throw new HttpsError(
          "internal",
          `Commit batch of recent users of venues failed. Error: ${error}`
        );
      });
    });
  });
