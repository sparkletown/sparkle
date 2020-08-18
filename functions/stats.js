const admin = require("firebase-admin");
const functions = require("firebase-functions");

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;

const eventIsNow = (event, now) => {
  const nowSeconds = now / 1000;
  return (
    nowSeconds > event.data().start_utc_seconds &&
    nowSeconds <
      60 * event.data().duration_minutes + event.data().start_utc_seconds
  );
};

exports.getOnlineStats = functions.https.onCall(async (data, context) => {
  const now = new Date().getTime();
  const userLastSeenLimit = (now - 24 * ONE_HOUR) / 1000;
  const users = await admin
    .firestore()
    .collection("users")
    .where("lastSeenAt", ">", userLastSeenLimit)
    .get();
  const onlineUsers = users.docs.map((doc) => {
    const userWithId = doc.data();
    userWithId.id = doc.id;
    return userWithId;
  });

  let openVenues = [];
  const venues = await admin.firestore().collection("venues").get();
  await Promise.all(
    venues.docs.map(async (venue) => {
      let venueOpen = false;
      await venue.ref
        .collection("events")
        .get()
        .then((events) => {
          events.docs.forEach((event) => {
            if (eventIsNow(event, now)) {
              venueOpen = true;
            }
          });
          if (venueOpen) {
            const venueWithId = venue.data();
            venueWithId.id = venue.id;
            openVenues.push(venueWithId);
          }
        });
    })
  );
  return { onlineUsers, openVenues };
});
