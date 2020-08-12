const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { checkAuth } = require("./auth");
const { HttpsError } = require("firebase-functions/lib/providers/https");
const PROJECT_ID = functions.config().project.id;

const DEFAULT_PRIMARY_COLOR = "#bc271a";
const VALID_TEMPLATES = [
  "jazzbar",
  "friendship",
  "partymap",
  "zoomroom",
  "themecamp",
  "artpiece",
  "artcar",
  "performancevenue",
];

const createVenueData = (data, context) => {
  if (!VALID_TEMPLATES.includes(data.template)) {
    throw new HttpsError(
      "invalid-argument",
      `Template ${data.template} unknown`
    );
  }

  const venueData = {
    template: data.template,
    name: data.name,
    config: {
      landingPageConfig: {
        checkList: [],
        coverImageUrl: data.bannerImageUrl,
        subtitle: data.subtitle,
        description: data.description,
      },
    },
    presentation: [],
    quotations: [],
    theme: {
      primaryColor: data.primaryColor || DEFAULT_PRIMARY_COLOR,
    },
    host: {
      icon: data.logoImageUrl,
    },
    code_of_conduct_questions: [],
    owners: [context.auth.token.user_id],
    profile_questions: data.profileQuestions,
    mapIconImageUrl: data.mapIconImageUrl,
  };

  switch (data.template) {
    case "jazzbar":
    case "performancevenue":
      venueData.iframeUrl = data.videoIframeUrl;
    case "partymap":
    case "themecamp":
      venueData.rooms = data.rooms;
    case "zoomroom":
    case "artcar":
      venueData.zoomUrl = data.zoomUrl;
    case "artpiece":
      venueData.embedIframeUrl;
  }
  return venueData;
};

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
      if (!venue.owners || !venue.owners.includes(uid)) {
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
  checkAuth(context);

  checkUserIsOwner(venueId, context.auth.token.user_id);

  await admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .get()
    .then((doc) => {
      if (!doc || !doc.exists) {
        throw new HttpsError("not-found", `Venue ${venueId} not found`);
      }
      const updated = doc.data();
      if (data.bannerImageUrl || data.subtitle || data.description) {
        if (!updated.config) {
          updated.config = {};
        }
        if (!updated.config.landingPageConfig) {
          updated.config.landingPageConfig = {};
        }
      }
      if (data.bannerImageUrl) {
        updated.config.landingPageConfig.bannerImageUrl = data.bannerImageUrl;
      }
      if (data.subtitle) {
        updated.config.landingPageConfig.subtitle = data.subtitle;
      }
      if (data.description) {
        updated.config.landingPageConfig.description = data.description;
      }
      if (data.primaryColor) {
        if (!updated.theme) {
          updated.theme = {};
        }
        updated.theme.primaryColor = data.primaryColor;
      }
      if (data.logoImageUrl) {
        if (!updated.host) {
          updated.host = {};
        }
        updated.host.icon = data.logoImageUrl;
      }
      if (data.profileQuestions) {
        updated.profileQuestions = data.profileQuestions;
      }
      if (data.mapIconImageUrl) {
        updated.mapIconImageUrl = data.mapIconImageUrl;
      }

      switch (updated.template) {
        case "jazzbar":
        case "performancevenue":
          if (data.videoIframeUrl) {
            updated.iframeUrl = data.videoIframeUrl;
          }
        case "partymap":
        case "themecamp":
          if (data.rooms) {
            updated.rooms = data.rooms;
          }
        case "zoomroom":
        case "artcar":
          if (data.zoomUrl) {
            updated.zoomUrl = data.zoomUrl;
          }
        case "artpiece":
          if (data.embedIframeUrl) {
            updated.embedIframeUrl = data.embedIframeUrl;
          }
      }

      admin.firestore().collection("venues").doc(venueId).update(updated);
    });

  return new HttpsError("ok", "Success");
});
