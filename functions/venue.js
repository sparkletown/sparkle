const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { checkAuth } = require("./auth");
const { HttpsError } = require("firebase-functions/lib/providers/https");
const PROJECT_ID = functions.config().project.id;
const PLAYA_VENUE_ID = "jamonline";

const VenueTemplate = {
  jazzbar: "jazzbar",
  friendship: "friendship",
  partymap: "partymap",
  zoomroom: "zoomroom",
  themecamp: "themecamp",
  artpiece: "artpiece",
  artcar: "artcar",
  performancevenue: "performancevenue",
  preplaya: "preplaya",
  playa: "playa",
  audience: "audience",
  avatargrid: "avatargrid",
};

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
  Hidden: "HIDDEN",
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
    showLiveSchedule: data.showLiveSchedule ? data.showLiveSchedule : false,
    showChat: true,
  };

  switch (data.template) {
    case "jazzbar":
    case "performancevenue":
    case "audience":
    case "artpiece":
      venueData.iframeUrl = data.iframeUrl;
      break;
    case "partymap":
    case "themecamp":
      venueData.rooms = data.rooms;
      venueData.mapBackgroundImageUrl = data.mapBackgroundImageUrl;
      venueData.roomVisibility = data.roomVisibility;
      break;
    case "zoomroom":
    case "artcar":
      venueData.zoomUrl = data.zoomUrl;
      break;
    case VenueTemplate.playa:
      venueData.roomVisibility = data.roomVisibility;
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

const checkUserIsAdminOrOwner = async (venueId, uid) => {
  try {
    return await checkUserIsOwner(venueId, uid);
  } catch (e) {
    return e.toString();
  }
};

exports.addVenueOwner = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const { venueId, newOwnerId } = data;
  await checkUserIsAdminOrOwner(venueId, context.auth.token.user_id);

  await admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .update({
      owners: admin.firestore.FieldValue.arrayUnion(newOwnerId),
    });
});

exports.removeVenueOwner = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const { venueId, ownerId } = data;
  await checkUserIsAdminOrOwner(venueId, context.auth.token.user_id);

  await admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .update({
      owners: admin.firestore.FieldValue.arrayRemove(ownerId),
    });
});

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
        docData.rooms.splice(index, 1);
      }

      admin.firestore().collection("venues").doc(venueId).update(docData);
    });
});

exports.toggleDustStorm = functions.https.onCall(async (_data, context) => {
  checkAuth(context);

  await checkUserIsOwner(PLAYA_VENUE_ID, context.auth.token.user_id);

  await admin
    .firestore()
    .collection("venues")
    .doc(PLAYA_VENUE_ID)
    .get()
    .then(async (doc) => {
      if (!doc || !doc.exists) {
        throw new HttpsError("not-found", `Venue ${PLAYA_VENUE_ID} not found`);
      }
      const updated = doc.data();
      updated.dustStorm = !updated.dustStorm;
      admin
        .firestore()
        .collection("venues")
        .doc(PLAYA_VENUE_ID)
        .update(updated);

      // Prevent dust storms lasting longer than one minute, even if the playa admin closes their tab.
      // Fetch the doc again, in case anything changed meanwhile.
      // This ties up firebase function execution time, but it would suck to leave the playa in dustStorm mode for hours.
      // Firebase functions time out after 60 seconds by default, so make this last 50 seconds to be safe
      if (updated.dustStorm) {
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await wait(50 * 1000);
        await admin
          .firestore()
          .collection("venues")
          .doc(PLAYA_VENUE_ID)
          .get()
          .then((doc) => {
            if (doc && doc.exists) {
              const updated = doc.data();
              updated.dustStorm = false;
              admin
                .firestore()
                .collection("venues")
                .doc(PLAYA_VENUE_ID)
                .update(updated);
            }
          });
      }
    });
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
      if (data.bannerMessage) {
        updated.bannerMessage = data.bannerMessage;
      }
      if (data.showLiveSchedule) {
        updated.showLiveSchedule = data.showLiveSchedule;
      }
      if (data.roomVisibility) {
        updated.roomVisibility = data.roomVisibility;
      }

      switch (updated.template) {
        case VenueTemplate.jazzbar:
        case VenueTemplate.performancevenue:
        case VenueTemplate.artpiece:
        case VenueTemplate.audience:
          if (data.iframeUrl) {
            updated.iframeUrl = data.iframeUrl;
          }
          break;
        case VenueTemplate.zoomroom:
        case VenueTemplate.artcar:
          if (data.zoomUrl) {
            updated.zoomUrl = data.zoomUrl;
          }
          break;
      }

      admin.firestore().collection("venues").doc(venueId).update(updated);
    });
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
  await checkUserIsOwner(PLAYA_VENUE_ID, context.auth.token.user_id);
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

      updated.width = data.width;
      updated.height = data.height;

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

exports.adminHideVenue = functions.https.onCall(async (data, context) => {
  const venueId = data.id;
  checkAuth(context);
  await checkUserIsOwner(PLAYA_VENUE_ID, context.auth.token.user_id);
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
      updated.placement.state = PlacementState.Hidden;
      admin.firestore().collection("venues").doc(venueId).update(updated);
    });
});

exports.adminUpdateBannerMessage = functions.https.onCall(
  async (data, context) => {
    await checkUserIsAdminOrOwner(data.venueId, context.auth.token.user_id);
    await admin
      .firestore()
      .collection("venues")
      .doc(data.venueId)
      .update({ bannerMessage: data.bannerMessage || null });
  }
);

exports.adminUpdateIframeUrl = functions.https.onCall(async (data, context) => {
  const { venueId, iframeUrl } = data;
  await checkUserIsOwner(venueId, context.auth.token.user_id);
  await admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .update({ iframeUrl: iframeUrl || null });
});

const dataOrUpdateKey = (data, updated, key) =>
  (data && data[key] && typeof data[key] !== "undefined" && data[key]) ||
  (updated &&
    updated[key] &&
    typeof updated[key] !== "undefined" &&
    updated[key]);
