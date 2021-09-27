/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {
  CallableContext,
  HttpsError,
} from "firebase-functions/lib/providers/https";

import { addAdmin, removeAdmin } from "./src/api/roles";

import { assertValidAuth } from "./src/utils/assert";
import { checkIfValidVenueId, getVenueId } from "./src/utils/venue";
import DocumentSnapshot = admin.firestore.DocumentSnapshot;

const PLAYA_VENUE_ID = "jamonline";

// These represent all of our venue templates (they should remain alphabetically sorted, deprecated should be separate from the rest)
// @debt unify this with VenueTemplate in src/types/venues.ts + share the same code between frontend/backend
enum VenueTemplate {
  artcar = "artcar",
  artpiece = "artpiece",
  audience = "audience",
  conversationspace = "conversationspace",
  embeddable = "embeddable",
  firebarrel = "firebarrel",
  friendship = "friendship",
  jazzbar = "jazzbar",
  partymap = "partymap",
  animatemap = "animatemap",
  performancevenue = "performancevenue",
  posterhall = "posterhall",
  posterpage = "posterpage",
  screeningroom = "screeningroom",
  themecamp = "themecamp",
  zoomroom = "zoomroom",

  /**
   * @deprecated Legacy template removed, perhaps try VenueTemplate.partymap instead?
   */
  avatargrid = "avatargrid",

  /**
   * @deprecated Legacy template removed, perhaps try VenueTemplate.partymap instead?
   */
  preplaya = "preplaya",

  /**
   * @deprecated Legacy template removed, perhaps try VenueTemplate.partymap instead?
   */
  playa = "playa",
}

const DEFAULT_PRIMARY_COLOR = "#bc271a";

// These templates are allowed to be used with createVenueData (they should remain alphabetically sorted)
const VALID_CREATE_TEMPLATES = [
  VenueTemplate.artcar,
  VenueTemplate.artpiece,
  VenueTemplate.audience,
  VenueTemplate.conversationspace,
  VenueTemplate.embeddable,
  VenueTemplate.firebarrel,
  VenueTemplate.friendship,
  VenueTemplate.jazzbar,
  VenueTemplate.partymap,
  VenueTemplate.animatemap,
  VenueTemplate.performancevenue,
  VenueTemplate.themecamp,
  VenueTemplate.zoomroom,
  VenueTemplate.screeningroom,
];

// These templates use iframeUrl (they should remain alphabetically sorted)
// @debt unify this with IFRAME_TEMPLATES in src/settings.ts + share the same code between frontend/backend
const IFRAME_TEMPLATES = [
  VenueTemplate.artpiece,
  VenueTemplate.audience,
  VenueTemplate.embeddable,
  VenueTemplate.firebarrel,
  VenueTemplate.jazzbar,
  VenueTemplate.performancevenue,
];

// These templates use zoomUrl (they should remain alphabetically sorted)
// @debt unify this with ZOOM_URL_TEMPLATES in src/settings.ts + share the same code between frontend/backend
const ZOOM_URL_TEMPLATES = [VenueTemplate.artcar, VenueTemplate.zoomroom];

// @debt unify this with HAS_REACTIONS_TEMPLATES in src/settings.ts + share the same code between frontend/backend
const HAS_REACTIONS_TEMPLATES = [VenueTemplate.audience, VenueTemplate.jazzbar];

// @debt unify this with DEFAULT_SHOW_REACTIONS / DEFAULT_SHOW_SHOUTOUTS / DEFAULT_ENABLE_JUKEBOX in src/settings.ts + share the same code between frontend/backend
const DEFAULT_SHOW_REACTIONS = true;
const DEFAULT_SHOW_SHOUTOUTS = true;
const DEFAULT_ENABLE_JUKEBOX = false;

const PlacementState = {
  SelfPlaced: "SELF_PLACED",
  AdminPlaced: "ADMIN_PLACED",
  Hidden: "HIDDEN",
};

const checkUserIsOwner = async (venueId: string, uid: string) => {
  await admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .get()
    .then(async (doc) => {
      const venue = getDocData(doc, "Venue");

      if (venue.owners && venue.owners.includes(uid)) return;

      if (venue.parentId) {
        const doc = await admin
          .firestore()
          .collection("venues")
          .doc(venue.parentId)
          .get();

        const parentVenue = getDocData(
          doc,
          `Venue ${venueId} references missing parent`
        );

        if (
          !(
            parentVenue &&
            parentVenue.owners &&
            parentVenue.owners.includes(uid)
          )
        ) {
          throw new HttpsError(
            "permission-denied",
            `User is not an owner of ${venueId} nor parent ${venue.parentId}`
          );
        }
      }

      throw new HttpsError(
        "permission-denied",
        `User is not an owner of ${venueId}`
      );
    })
    .catch((err) => {
      throw new HttpsError(
        "internal",
        `Error occurred obtaining venue ${venueId}: ${err.toString()}`
      );
    });
};

// @debt extract this into a new functions/chat backend script file
const checkIfUserHasVoted = async (
  venueId: string,
  pollId: string,
  userId: string
) => {
  await admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection("chats")
    .doc(pollId)
    .get()
    .then((doc) => {
      const poll = getDocData(doc, "Poll");

      return poll?.votes.some(
        // @ts-ignore
        ({ userId: existingUserId }) => userId === existingUserId
      );
    })
    .catch((err) => {
      throw new HttpsError(
        "internal",
        `Error occurred obtaining venue ${venueId}: ${err.toString()}`
      );
    });
};

// @debt this should be de-duplicated + aligned with createVenueData_v2 to ensure they both cover all needed cases
const createVenueData = (data: any, context: CallableContext) => {
  if (!VALID_CREATE_TEMPLATES.includes(data.template)) {
    throw new HttpsError(
      "invalid-argument",
      `Template ${data.template} unknown`
    );
  }

  let owners = [context.auth?.token.user_id];
  if (data.owners) {
    owners = [...owners, ...data.owners];
  }

  const venueData: any = {
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
    owners,
    code_of_conduct_questions: data.code_of_conduct_questions || [],
    profile_questions: data.profile_questions,
    entrance: data.entrance || [],
    placement: { ...data.placement, state: PlacementState.SelfPlaced },
    // @debt find a way to share src/settings with backend functions, then use DEFAULT_SHOW_SCHEDULE here
    showSchedule:
      typeof data.showSchedule === "boolean" ? data.showSchedule : true,
    showChat: true,
    parentId: data.parentId,
    attendeesTitle: data.attendeesTitle || "partygoers",
    chatTitle: data.chatTitle || "Party",
    requiresDateOfBirth: data.requiresDateOfBirth || false,
    userStatuses: data.userStatuses || [],
    showRadio: data.showRadio || false,
    showUserStatus:
      typeof data.showUserStatus === "boolean" ? data.showUserStatus : true,
    radioStations: data.radioStations ? [data.radioStations] : [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  if (data.mapBackgroundImageUrl) {
    venueData.mapBackgroundImageUrl = data.mapBackgroundImageUrl;
  }

  if (data.template === VenueTemplate.jazzbar) {
    venueData.enableJukebox =
      typeof data.enableJukebox === "boolean"
        ? data.enableJukebox
        : DEFAULT_ENABLE_JUKEBOX;
  }
  // @debt showReactions and showShoutouts should be toggleable for anything in HAS_REACTIONS_TEMPLATES
  if (HAS_REACTIONS_TEMPLATES.includes(data.template)) {
    venueData.showReactions =
      typeof data.showReactions === "boolean"
        ? data.showReactions
        : DEFAULT_SHOW_REACTIONS;

    venueData.showShoutouts =
      typeof data.showShoutouts === "boolean"
        ? data.showShoutouts
        : DEFAULT_SHOW_SHOUTOUTS;

    if (data.auditoriumColumns) {
      venueData.auditoriumColumns = data.auditoriumColumns;
    }

    if (data.auditoriumRows) {
      venueData.auditoriumRows = data.auditoriumRows;
    }
  }

  if (IFRAME_TEMPLATES.includes(data.template)) {
    venueData.iframeUrl = data.iframeUrl;
    venueData.autoPlay = data.autoPlay;
  }

  if (ZOOM_URL_TEMPLATES.includes(data.template)) {
    venueData.zoomUrl = data.zoomUrl;
  }

  switch (data.template) {
    case VenueTemplate.animatemap:
    case VenueTemplate.partymap:
    case VenueTemplate.themecamp:
      venueData.rooms = data.rooms;
      venueData.roomVisibility = data.roomVisibility;
      venueData.showGrid = data.showGrid ? data.showGrid : false;
      break;

    case VenueTemplate.playa:
      venueData.roomVisibility = data.roomVisibility;
      break;

    default:
      break;
  }

  return venueData;
};

// @debt this should be de-duplicated + aligned with createVenueData to ensure they both cover all needed cases
const createVenueData_v2 = (data: any, context: CallableContext) => {
  const venueData_v2 = {
    name: data.name,
    config: {
      landingPageConfig: {
        coverImageUrl: data.bannerImageUrl,
        subtitle: data.subtitle,
        description: data.description,
      },
    },
    theme: {
      primaryColor: data.primaryColor || DEFAULT_PRIMARY_COLOR,
    },
    host: {
      icon: data.logoImageUrl,
    },
    owners: [context.auth?.token.user_id],
    showGrid: data.showGrid || false,
    ...(data.showGrid && { columns: data.columns }),
    template: data.template || VenueTemplate.partymap,
    rooms: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    worldId: data.worldId,
  };

  if (data.template === VenueTemplate.jazzbar) {
    venueData_v2.enableJukebox =
      typeof data.enableJukebox === "boolean"
        ? data.enableJukebox
        : DEFAULT_ENABLE_JUKEBOX;
  }

  if (HAS_REACTIONS_TEMPLATES.includes(data.template)) {
    venueData_v2.showReactions =
      typeof data.showReactions === "boolean"
        ? data.showReactions
        : DEFAULT_SHOW_REACTIONS;

    venueData_v2.showShoutouts =
      typeof data.showShoutouts === "boolean"
        ? data.showShoutouts
        : DEFAULT_SHOW_SHOUTOUTS;
  }

  return venueData_v2;
};

// @debt refactor function so it doesn't mutate the passed in updated object, but efficiently returns an updated one instead
const createBaseUpdateVenueData = (data: any, doc: any) => {
  const updated = doc.data() as any;

  if (data.subtitle || data.subtitle === "") {
    updated.config.landingPageConfig.subtitle = data.subtitle;
  }

  if (data.description || data.description === "") {
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

  if (data.profile_questions) {
    updated.profile_questions = data.profile_questions;
  }

  if (data.entrance) {
    updated.entrance = data.entrance;
  }

  if (data.mapBackgroundImageUrl) {
    updated.mapBackgroundImageUrl = data.mapBackgroundImageUrl;
  }

  // @debt do we need to be able to set this here anymore? I think we have a dedicated function for it?
  if (data.bannerMessage) {
    updated.bannerMessage = data.bannerMessage;
  }

  if (data.parentId) {
    updated.parentId = data.parentId;
  }

  if (data.roomVisibility) {
    updated.roomVisibility = data.roomVisibility;
  }

  if (typeof data.showSchedule === "boolean") {
    updated.showSchedule = data.showSchedule;
  }

  if (typeof data.showBadges === "boolean") {
    updated.showBadges = data.showBadges;
  }

  if (typeof data.showReactions === "boolean") {
    updated.showReactions = data.showReactions;
  }

  if (typeof data.enableJukebox === "boolean") {
    updated.enableJukebox = data.enableJukebox;
  }

  if (typeof data.showUserStatus === "boolean") {
    updated.showUserStatus = data.showUserStatus;
  }

  if (typeof data.showShoutouts === "boolean") {
    updated.showShoutouts = data.showShoutouts;
  }

  if (data.userStatuses) {
    updated.userStatuses = data.userStatuses;
  }

  if (data.attendeesTitle) {
    updated.attendeesTitle = data.attendeesTitle;
  }

  if (data.chatTitle) {
    updated.chatTitle = data.chatTitle;
  }

  if (data.code_of_conduct_questions) {
    updated.code_of_conduct_questions = data.code_of_conduct_questions;
  }

  if (data.showNametags) {
    updated.showNametags = data.showNametags;
  }

  updated.autoPlay = data.autoPlay !== undefined ? data.autoPlay : false;
  updated.updatedAt = Date.now();

  return updated;
};

const dataOrUpdateKey = (data: any, updated: any, key: string) =>
  (data && data[key] && typeof data[key] !== "undefined" && data[key]) ||
  (updated &&
    updated[key] &&
    typeof updated[key] !== "undefined" &&
    updated[key]);

export const addVenueOwner = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  const { venueId, newOwnerId } = data;

  await checkUserIsOwner(venueId, context.auth?.token.user_id);

  await admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .update({
      owners: admin.firestore.FieldValue.arrayUnion(newOwnerId),
    });

  // When adding a user to the list of owners,
  // the user is also added to the list of admins in the "roles" collection
  await addAdmin(newOwnerId);
});

export const removeVenueOwner = functions.https.onCall(
  async (data, context) => {
    assertValidAuth(context);

    const { venueId, ownerId } = data;
    await checkUserIsOwner(venueId, context.auth?.token.user_id);

    await admin
      .firestore()
      .collection("venues")
      .doc(venueId)
      .update({
        owners: admin.firestore.FieldValue.arrayRemove(ownerId),
      });

    // If a user is not an owner of any venue,
    // remove the user from the list of admins
    const snap = await admin
      .firestore()
      .collection("venues")
      .where("owners", "array-contains", ownerId)
      .get();
    if (snap.empty) removeAdmin(ownerId);
  }
);

// @debt this should be de-duplicated + aligned with createVenue_v2 to ensure they both cover all needed cases
export const createVenue = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  // @debt this should be typed
  const venueData = createVenueData(data, context);
  const venueId = getVenueId(data.name);

  await admin.firestore().collection("venues").doc(venueId).set(venueData);

  return venueData;
});

// @debt this should be de-duplicated + aligned with createVenue to ensure they both cover all needed cases
export const createVenue_v2 = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  const venueData = createVenueData_v2(data, context);
  const venueId = getVenueId(data.name);

  await admin.firestore().collection("venues").doc(venueId).set(venueData);

  return venueData;
});

export const upsertRoom = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);
  const { venueId, roomIndex, room } = data;
  await checkUserIsOwner(venueId, context.auth?.token.user_id);
  const doc = await admin.firestore().collection("venues").doc(venueId).get();

  const docData = getDocData(doc, "Venue");

  let rooms = docData.rooms;

  if (typeof roomIndex !== "number") {
    rooms = [...rooms, room];
  } else {
    rooms[roomIndex] = room;
  }

  return admin.firestore().collection("venues").doc(venueId).update({ rooms });
});

export const deleteRoom = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);
  const { venueId, room } = data;
  await checkUserIsOwner(venueId, context.auth?.token.user_id);
  const doc = await admin.firestore().collection("venues").doc(venueId).get();

  const docData = getDocData(doc, "Venue");
  const rooms = docData.rooms;

  //if the room exists under the same name, find it
  // @ts-ignore
  const index = rooms.findIndex((val) => val.title === room.title);
  if (index === -1) {
    throw new HttpsError("not-found", "Room does not exist");
  } else {
    docData.rooms.splice(index, 1);
  }

  return admin.firestore().collection("venues").doc(venueId).update(docData);
});

// @debt this is almost a line for line duplicate of exports.updateVenue_v2, we should de-duplicate/DRY these up
export const updateVenue = functions.https.onCall(async (data, context) => {
  const venueId = data.id || getVenueId(data.name);
  assertValidAuth(context);

  // @debt updateVenue_v2 uses checkUserIsAdminOrOwner rather than checkUserIsOwner. Should these be the same? Which is correct?
  await checkUserIsOwner(venueId, context.auth?.token.user_id);

  // @debt We should validate venueId conforms to our valid patterns before attempting to use it in a query
  const doc = await admin.firestore().collection("venues").doc(venueId).get();

  checkDoc(doc, "Venue");

  const updated = createBaseUpdateVenueData(data, doc);

  // @debt this is missing from updateVenue_v2, why is that? Do we need it there/here?
  if (data.bannerImageUrl || data.subtitle || data.description) {
    if (!updated.config) {
      updated.config = {};
    }
    if (!updated.config.landingPageConfig) {
      updated.config.landingPageConfig = {};
    }
  }

  // @debt in updateVenue_v2 this is configured as:
  //   updated.config.landingPageConfig.coverImageUrl = data.bannerImageUrl
  //     Should they be the same? If so, which is correct?
  if (data.bannerImageUrl) {
    updated.config.landingPageConfig.bannerImageUrl = data.bannerImageUrl;
  }

  // @debt this is missing from updateVenue_v2, why is that? Do we need it there/here?
  //   I expect this may be legacy functionality related to the Playa template?
  // if (
  //   !data.placement.state ||
  //   data.placement.state === PlacementState.SelfPlaced
  // ) {
  //   updated.placement = {
  //     ...data.placement,
  //     state: PlacementState.SelfPlaced,
  //   };
  // } else if (data.placementRequests) {
  //   updated.placementRequests = data.placementRequests;
  // }

  // @debt the logic here differs from updateVenue_v2, which only sets this field when data.showGrid is a boolean
  if (data.columns) {
    updated.columns = data.columns;
  }

  // @debt this is almost the same as in updateVenue_v2, though v2 includes data.columns within this if as well
  if (typeof data.showGrid === "boolean") {
    updated.showGrid = data.showGrid;
  }

  // @debt this is missing from updateVenue_v2, why is that? Do we need it there/here?
  if (data.auditoriumColumns) {
    updated.auditoriumColumns = data.auditoriumColumns;
  }

  // @debt this is missing from updateVenue_v2, why is that? Do we need it there/here?
  if (data.auditoriumRows) {
    updated.auditoriumRows = data.auditoriumRows;
  }

  // @debt this is almost the same as in updateVenue_v2, though v2 includes data.radioStations within this if as well
  if (typeof data.showRadio === "boolean") {
    updated.showRadio = data.showRadio;
  }

  // @debt the logic here differs from updateVenue_v2, which only sets this field when data.showRadio is a boolean
  if (data.radioStations) {
    updated.radioStations = [data.radioStations];
  }

  // @debt the logic here differs from updateVenue_v2,
  // @debt this would currently allow any value to be set in this field, not just booleans
  updated.requiresDateOfBirth = data.requiresDateOfBirth || false;

  // @debt this is missing from updateVenue_v2, why is that? Do we need it there/here?
  if (IFRAME_TEMPLATES.includes(updated.template) && data.iframeUrl) {
    updated.iframeUrl = data.iframeUrl;
  }

  // @debt this is missing from updateVenue_v2, why is that? Do we need it there/here?
  if (ZOOM_URL_TEMPLATES.includes(updated.template) && data.zoomUrl) {
    updated.zoomUrl = data.zoomUrl;
  }

  // @debt this is exactly the same as in updateVenue_v2
  await admin.firestore().collection("venues").doc(venueId).update(updated);
});

// @debt this is almost a line for line duplicate of exports.updateVenue, we should de-duplicate/DRY these up
export const updateVenue_v2 = functions.https.onCall(async (data, context) => {
  const venueId = getVenueId(data.name);
  assertValidAuth(context);

  // @debt updateVenue uses checkUserIsOwner rather than checkUserIsAdminOrOwner. Should these be the same? Which is correct?
  await checkUserIsOwner(venueId, context.auth?.token.user_id);

  if (!data.worldId) {
    throw new HttpsError(
      "not-found",
      "World id is missing and the update can not be executed."
    );
  }

  // @debt We should validate venueId conforms to our valid patterns before attempting to use it in a query
  const doc = await admin.firestore().collection("venues").doc(venueId).get();

  // @debt this is exactly the same as in updateVenue
  checkDoc(doc, "Venue");

  // @debt refactor function so it doesn't mutate the passed in updated object, but efficiently returns an updated one instead
  const updated = createBaseUpdateVenueData(data, doc);

  // @debt in updateVenue we're checking/creating the updated.config object here if needed.
  //   Should we also be doing that here in updateVenue_v2? If not, why don't we need to?

  // @debt in updateVenue this is configured as:
  //   updated.config.landingPageConfig.bannerImageUrl = data.bannerImageUrl
  //     Should they be the same? If so, which is correct?
  if (data.bannerImageUrl) {
    updated.config.landingPageConfig.coverImageUrl = data.bannerImageUrl;
  }

  if (data.start_utc_seconds) {
    updated.start_utc_seconds = data.start_utc_seconds;
  }

  if (data.end_utc_seconds) {
    updated.end_utc_seconds = data.end_utc_seconds;
  }

  // @debt aside from the data.columns part, this is exactly the same as in updateVenue
  if (typeof data.showGrid === "boolean") {
    updated.showGrid = data.showGrid;
    // @debt the logic here differs from updateVenue, as data.columns is always set when present there
    updated.columns = data.columns;
  }

  // @debt the logic here differs from updateVenue
  if (typeof data.requiresDateOfBirth === "boolean") {
    updated.requiresDateOfBirth = data.requiresDateOfBirth;
  }

  // @debt aside from the data.radioStations part, this is exactly the same as in updateVenue
  if (typeof data.showRadio === "boolean") {
    updated.showRadio = data.showRadio;
    // @debt the logic here differs from updateVenue, as data.radioStations is always set when present there
    updated.radioStations = [data.radioStations];
  }

  // @debt this is exactly the same as in updateVenue
  admin.firestore().collection("venues").doc(venueId).update(updated);
});

export const updateTables = functions.https.onCall((data, context) => {
  assertValidAuth(context);

  const isValidVenueId = checkIfValidVenueId(data.venueId);

  if (!isValidVenueId) {
    throw new HttpsError("invalid-argument", `venueId is not a valid venue id`);
  }

  const venueRef = admin.firestore().collection("venues").doc(data.venueId);

  return admin.firestore().runTransaction(async (transaction) => {
    const venueDoc = await transaction.get(venueRef);

    checkDoc(venueDoc, "Venue");

    const venueTables = [...data.tables];

    const currentTableIndex = venueTables.findIndex(
      (table) => table.reference === data.updatedTable.reference
    );

    if (currentTableIndex < 0) {
      throw new HttpsError(
        "not-found",
        `current table does not exist in the venue`
      );
    }

    venueTables[currentTableIndex] = data.updatedTable;

    transaction.update(venueRef, { "config.tables": venueTables });
  });
});

export const deleteVenue = functions.https.onCall(async (data, context) => {
  const venueId = getVenueId(data.id);
  assertValidAuth(context);

  await checkUserIsOwner(venueId, context.auth?.token.user_id);

  admin.firestore().collection("venues").doc(venueId).delete();
});

// @debt extract this into a new functions/chat backend script file
export const voteInPoll = functions.https.onCall(
  async ({ venueId, pollVote }, context) => {
    assertValidAuth(context);

    const { pollId, questionId } = pollVote;

    const userId = context.auth?.token.user_id;
    try {
      await checkIfUserHasVoted(venueId, pollId, context.auth?.token.user_id);

      const newVote = {
        questionId,
        userId,
      };

      return admin
        .firestore()
        .collection("venues")
        .doc(venueId)
        .collection("chats")
        .doc(pollId)
        .update({
          votes: admin.firestore.FieldValue.arrayUnion(newVote),
        });
    } catch (error) {
      throw new HttpsError(
        "unknown",
        `User ${userId} has voted in ${pollId} Poll`,
        error
      );
    }
  }
);

export const adminUpdatePlacement = functions.https.onCall(
  async (data, context) => {
    const venueId = data.id;
    assertValidAuth(context);
    await checkUserIsOwner(PLAYA_VENUE_ID, context.auth?.token.user_id);
    const doc = await admin.firestore().collection("venues").doc(venueId).get();

    const updated = getDocData(doc, "Venue");

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

    return admin.firestore().collection("venues").doc(venueId).update(updated);
  }
);

export const adminHideVenue = functions.https.onCall(async (data, context) => {
  const venueId = data.id;
  assertValidAuth(context);
  await checkUserIsOwner(PLAYA_VENUE_ID, context.auth?.token.user_id);
  const doc = await admin.firestore().collection("venues").doc(venueId).get();

  const updated = getDocData(doc, "Venue");

  updated.placement.state = PlacementState.Hidden;
  return admin.firestore().collection("venues").doc(venueId).update(updated);
});

export const adminUpdateBannerMessage = functions.https.onCall(
  async (data, context) => {
    await checkUserIsOwner(data.venueId, context.auth?.token.user_id);
    await admin
      .firestore()
      .collection("venues")
      .doc(data.venueId)
      .update({ bannerMessage: data.bannerMessage || null });
  }
);

export const adminUpdateIframeUrl = functions.https.onCall(
  async (data, context) => {
    const { venueId, iframeUrl } = data;
    await checkUserIsOwner(venueId, context.auth?.token.user_id);
    await admin
      .firestore()
      .collection("venues")
      .doc(venueId)
      .update({ iframeUrl: iframeUrl || null });
  }
);

export const getOwnerData = functions.https.onCall(async ({ userId }) =>
  (await admin.firestore().collection("users").doc(userId).get()).data()
);

export const setVenueLiveStatus = functions.https.onCall(
  async (data, context) => {
    assertValidAuth(context);

    const isValidVenueId = checkIfValidVenueId(data.venueId);

    if (!isValidVenueId) {
      throw new HttpsError(
        "invalid-argument",
        `venueId is not a valid venue id`
      );
    }

    if (typeof data.isLive !== "boolean") {
      throw new HttpsError("invalid-argument", `isLive is not a boolean`);
    }

    const update = {
      isLive: Boolean(data.isLive),
    };

    await admin
      .firestore()
      .collection("venues")
      .doc(data.venueId)
      .update(update);
  }
);

const checkDoc = (
  doc: DocumentSnapshot | undefined,
  prefix = "Document",
  predicate: () => boolean = () => false
) => {
  if (!doc || !doc.exists || !predicate()) {
    throw new HttpsError("not-found", `${prefix} ${doc?.id} not found`);
  }
};

const getDocData = (
  doc: DocumentSnapshot | undefined,
  prefix = "Document"
): any => {
  const docData = doc?.data();
  checkDoc(doc, prefix, () => Boolean(docData));

  return docData;
};
