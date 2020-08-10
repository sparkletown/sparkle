const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { checkAuth } = require("./auth");
const { HttpsError } = require("firebase-functions/lib/providers/https");
const PROJECT_ID = functions.config().project.id;

const DEFAULT_PRIMARY_COLOR = "#bc271a";

const createVenueData = (data, context) => {
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
        if (!doc.config) {
          doc.config = {};
        }
        if (!doc.config.landingPageConfig) {
          doc.config.landingPageConfig = {};
        }
      }
      if (data.bannerImageUrl) {
        doc.config.landingPageConfig.bannerImageUrl = data.bannerImageUrl;
      }
      if (data.subtitle) {
        doc.config.landingPageConfig.subtitle = data.subtitle;
      }
      if (data.description) {
        doc.config.landingPageConfig.description = data.description;
      }
      if (data.primaryColor) {
        if (!doc.theme) {
          doc.theme = {};
        }
        doc.theme.primaryColor = data.primaryColor;
      }
      if (data.logoImageUrl) {
        if (!doc.host) {
          doc.host = {};
        }
        doc.host.icon = data.logoImageUrl;
      }
      if (data.profileQuestions) {
        doc.profileQuestions = data.profileQuestions;
      }
      if (data.mapIconImageUrl) {
        doc.mapIconImageUrl = data.mapIconImageUrl;
      }

      switch (doc.template) {
        case "jazzbar":
        case "performancevenue":
          if (data.videoIframeUrl) {
            doc.iframeUrl = data.videoIframeUrl;
          }
        case "partymap":
        case "themecamp":
          if (data.rooms) {
            doc.rooms = data.rooms;
          }
        case "zoomroom":
        case "artcar":
          if (data.zoomUrl) {
            doc.zoomUrl = data.zoomUrl;
          }
        case "artpiece":
          if (data.embedIframeUrl) {
            doc.embedIframeUrl = data.embedIframeUrl;
          }
      }
    });

  return new HttpsError("ok", "Success");
});
