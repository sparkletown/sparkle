const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { checkAuth } = require("./auth");
const { HttpsError } = require("firebase-functions/lib/providers/https");
const PROJECT_ID = functions.config().project.id;

const createVenueData = (data, context) => ({
  code_of_conduct_questions: [
    {
      name: "contributeToExperience",
      text: "Are you willing to contribute to the experience?",
    },
  ],
  config: {
    landingPageConfig: {
      checkList: [],
      coverImageUrl: data.bannerImageUrl,
      joinButtonText: "Enter our venue",
      subtitle: data.tagline,
      description: data.longDescription,
    },
  },
  presentation: [data.longDescription],
  quotations: [],
  videoIframeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  theme: {
    primaryColor: "#bc271a",
  },
  host: {
    icon: data.logoImageUrl,
  },
  iframeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  name: data.name,
  profile_questions: [{ name: "Dance", text: "Do you dance?" }],
  template: "performancevenue",
  owners: [context.auth.token.user_id],
  profile_questions: data.profileQuestions,
  mapIconImageUrl: data.mapIconImageUrl,
  //@debt need to do something with mapIconUrl
});

const getVenueId = (name) => {
  return name.replace(/\W/g, "").toLowerCase();
};

const checkUserIsOwner = async (venueId, uid) => {
  await admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        throw new HttpsError("not-found", `Venue ${venueId} does not exist`);
      }
      const venue = doc.data();
      if (!doc.owners || !doc.owners.includes(uid)) {
        throw new HttpsError(
          "permission-denied",
          `User is not an owner of ${venueId}`
        );
      }
    })
    .catch((err) => {
      throw new HttpsError(
        "internal",
        `Error occurred obtaining venue ${venueId}: ${err.toString()}`
      );
    });
};

exports.createVenue = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  // @debt this should be typed
  const venueData = createVenueData(data, context);
  const venueId = getVenueId(data.name);

  await admin.firestore().collection("venues").doc(venueId).set(venueData);

  return venueData;
});

exports.updateVenue = functions.https.onCall(async (data, context) => {
  const venueId = getVenueId(data.name);
  checkAuth(venueId, context);

  checkUserIsOwner(venueId, context.auth.token.user_id);

  // @debt this should be typed
  const venueData = createVenueData(data, context);

  await admin.firestore().collection("venues").doc(venueId).update(venueData);

  return venueData;
});
