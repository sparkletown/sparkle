const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { checkAuth } = require("./auth");
const { HttpsError } = require("firebase-functions/lib/providers/https");
const PROJECT_ID = functions.config().project.id;
const PLAYA_VENUE_ID = "playa";

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

const PlacementState = {
  SelfPlaced: "SELF_PLACED",
  AdminPlaced: "ADMIN_PLACED",
};

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
    placement: { ...data.placement, state: PlacementState.SelfPlaced },
  };

  switch (data.template) {
    case "jazzbar":
    case "performancevenue":
      venueData.iframeUrl = data.videoIframeUrl;
      break;
    case "partymap":
    case "themecamp":
      venueData.rooms = data.rooms;
      venueData.mapBackgroundImageUrl = data.mapBackgroundImageUrl;
      break;
    case "zoomroom":
    case "artcar":
      venueData.zoomUrl = data.zoomUrl;
      break;
    case "artpiece":
      venueData.embedIframeUrl = data.embedIframeUrl;
      break;
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

const checkUserIsPlayaOwner = (uid) => {
  return checkUserIsOwner(PLAYA_VENUE_ID, uid);
};

const checkUserIsAdminOrOwner = async (venueId, uid) => {
  try {
    return await checkUserIsPlayaOwner(uid);
  } catch (e) {
    return checkUserIsOwner(venueId, uid);
  }
};

exports.createVenue = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  // @debt this should be typed
  const venueData = createVenueData(data, context);
  const venueId = getVenueId(data.name);

  await admin.firestore().collection("venues").doc(venueId).set(venueData);

  return venueData;
});

exports.upsertRoom = functions.https.onCall(async (data, context) => {
  checkAuth(context);
  const { venueId, roomIndex, room } = data;
  await checkUserIsAdminOrOwner(venueId, context.auth.token.user_id);
  await admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .get()
    .then((doc) => {
      if (!doc || !doc.exists) {
        throw new HttpsError("not-found", `Venue ${venueId} not found`);
      }
      const docData = doc.data();

      if (typeof roomIndex !== "number") {
        docData.rooms = [...docData.rooms, room];
      } else {
        docData.rooms[roomIndex] = room;
      }

      admin.firestore().collection("venues").doc(venueId).update(docData);
    });
});

exports.deleteRoom = functions.https.onCall(async (data, context) => {
  checkAuth(context);
  const { venueId, room } = data;
  await checkUserIsAdminOrOwner(venueId, context.auth.token.user_id);
  await admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .get()
    .then((doc) => {
      if (!doc || !doc.exists) {
        throw new HttpsError("not-found", `Venue ${venueId} not found`);
      }
      const docData = doc.data();
      const rooms = docData.rooms;

      //if the room exists under the same name, find it
      const index = rooms.findIndex((val) => val.title === room.title);
      if (index === -1) {
        throw new HttpsError("not-found", "Room does not exist");
      } else {
        docData.splice(index, 1);
      }

      admin.firestore().collection("venues").doc(venueId).update(docData);
    });
});

exports.toggleDustStorm = functions.https.onCall(async (_data, context) => {
  checkAuth(context);

  await checkUserIsPlayaOwner(context.auth.token.user_id);

  await admin
    .firestore()
    .collection("venues")
    .doc("playa")
    .get()
    .then((doc) => {
      if (!doc || !doc.exists) {
        throw new HttpsError("not-found", `Venue playa not found`);
      }
      const updated = doc.data();
      updated.dustStorm = !updated.dustStorm;
      admin.firestore().collection("venues").doc("playa").update(updated);
    });

  return new HttpsError("ok", "Success");
});

exports.updateVenue = functions.https.onCall(async (data, context) => {
  const venueId = getVenueId(data.name);
  checkAuth(context);

  await checkUserIsAdminOrOwner(venueId, context.auth.token.user_id);

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
      if (data.mapBackgroundImageUrl) {
        updated.mapBackgroundImageUrl = data.mapBackgroundImageUrl;
      }

      if (
        !data.placement.state ||
        data.placement.state === PlacementState.SelfPlaced
      ) {
        updated.placement = {
          ...data.placement,
          state: PlacementState.SelfPlaced,
        };
      } else if (data.placementRequests) {
        updated.placementRequests = data.placementRequests;
      }

      switch (updated.template) {
        case "jazzbar":
        case "performancevenue":
          if (data.videoIframeUrl) {
            updated.iframeUrl = data.videoIframeUrl;
          }
          break;
        case "zoomroom":
        case "artcar":
          if (data.zoomUrl) {
            updated.zoomUrl = data.zoomUrl;
          }
          break;
        case "artpiece":
          if (data.embedIframeUrl) {
            updated.embedIframeUrl = data.embedIframeUrl;
          }
          break;
      }

      admin.firestore().collection("venues").doc(venueId).update(updated);
    });

  return new HttpsError("ok", "Success");
});

exports.deleteVenue = functions.https.onCall(async (data, context) => {
  const venueId = getVenueId(data.id);
  checkAuth(context);

  await checkUserIsAdminOrOwner(venueId, context.auth.token.user_id);

  admin.firestore().collection("venues").doc(venueId).delete();
});

exports.adminUpdatePlacement = functions.https.onCall(async (data, context) => {
  const venueId = data.id;
  checkAuth(context);
  await checkUserIsPlayaOwner(context.auth.token.user_id);
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
      updated.mapIconImageUrl = data.mapIconImageUrl || updated.mapIconImageUrl;
      updated.placement = {
        x: dataOrUpdateKey(data.placement, updated.placement, "x"),
        y: dataOrUpdateKey(data.placement, updated.placement, "y"),
        state: PlacementState.AdminPlaced,
      };

      const addressText = dataOrUpdateKey(
        data.placement,
        updated.placement,
        "addressText"
      );
      const notes = dataOrUpdateKey(data.placement, updated.placement, "notes");

      if (addressText) {
        updated.placement.addressText = addressText;
      }
      if (notes) {
        updated.placement.notes = notes;
      }

      admin.firestore().collection("venues").doc(venueId).update(updated);
    });
});

const dataOrUpdateKey = (data, updated, key) =>
  (data && data[key] && typeof data[key] !== "undefined" && data[key]) ||
  (updated &&
    updated[key] &&
    typeof updated[key] !== "undefined" &&
    updated[key]);
