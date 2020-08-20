const admin = require("firebase-admin");
const functions = require("firebase-functions");

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;

const eventIsNow = (event, now) => {
  const nowSeconds = now / 1000;
  return (
    nowSeconds > event.start_utc_seconds &&
    nowSeconds < 60 * event.duration_minutes + event.start_utc_seconds
  );
};

exports.getOnlineStats = functions.https.onCall(async (data, context) => {
  const now = new Date().getTime();
  const userLastSeenLimit = (now - ONE_HOUR) / 1000;
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
      const template = venue.data().template;
      const openWithoutEvents =
        template === "artpiece" || template === "themecamp";
      await venue.ref
        .collection("events")
        .get()
        .then((events) => {
          const currentEvents = events.docs
            .map((event) => event.data())
            .filter((event) => eventIsNow(event, now));
          const venueOpen = currentEvents.length > 0;

          if (venueOpen || openWithoutEvents) {
            const venueWithId = venue.data();
            venueWithId.id = venue.id;
            openVenues.push({
              venue: venueWithId,
              currentEvents: currentEvents,
            });
          }
        });
    })
  );
  return { onlineUsers, openVenues };
});
