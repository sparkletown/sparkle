const admin = require("firebase-admin");

const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");

const { chunk, sampleSize } = require("lodash");

const DEFAULT_RECENT_USERS_IN_VENUE_CHUNK_SIZE = 6;
const SECTION_PREVIEW_USER_DISPLAY_COUNT = 14;

exports.updateSeatedUsersCountInAuditorium = functions.pubsub
  .schedule("every 5 seconds")
  .onRun(async () => {
    const firestore = admin.firestore();
    const auditoriums = await firestore
      .collection("venues")
      .where("template", "==", "auditorium")
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

    const batch = admin.firestore().batch();
    auditoriums.forEach((auditorium) =>
      auditorium.sections
        .filter((section) => section.seatedUsers?.length > 0)
        .forEach((section) =>
          batch.update(
            firestore
              .collection("venues")
              .doc(auditorium.id)
              .collection("sections")
              .doc(section.id),
            {
              seatedUsersCount: section.seatedUsers.length,
              seatedUsersSample: section.seatedUsers.splice(
                0,
                SECTION_PREVIEW_USER_DISPLAY_COUNT
              ),
            }
          )
        )
    );

    batch.commit().catch((error) => {
      throw new HttpsError(
        "internal",
        `Commit batch of auditoriums sections update. Error: ${error}`
      );
    });
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

    const usersPromise = admin
      .firestore()
      .collection("users")
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
