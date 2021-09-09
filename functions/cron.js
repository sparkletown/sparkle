const admin = require("firebase-admin");
const functions = require("firebase-functions");

exports.scheduledFunction = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const venues = await admin
      .firestore()
      .collection("venues")
      .get()
      .then((doc) => {
        if (!doc.exists) {
          throw new HttpsError("not-found", `Venues do not exist`);
        }
        return { ...doc.data(), id: doc.id };
      });

    const users = await admin
      .firestore()
      .collection("users")
      .get()
      .then((doc) => {
        if (!doc.exists) {
          throw new HttpsError("not-found", `Users do not exist`);
        }
        return { ...doc.data(), id: doc.id };
      });

    venues.forEach((venue) => {
      const recentVenueUsers = users.filter((user) =>
        user.lastVenueIdSeenIn?.includes(venue.id)
      );

      const recentVenueUsersCount = recentVenueUsers.length;

      const venueRef = admin.firestore().collection("venues").doc(venue.id);

      venueRef.update({
        recentUserCount: recentVenueUsersCount,
        recentUsersSample: recentVenueUsersCount.slice(
          0,
          Math.min(recentVenueUsersCount, 6)
        ),
      });
    });

    return null;
  });
