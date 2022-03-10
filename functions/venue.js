const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");

const { addAdmin, removeAdmin } = require("./src/api/roles");

const { checkAuth } = require("./src/utils/assert");
const { checkIfValidVenueId } = require("./src/utils/venue");
const { ROOM_TAXON } = require("./taxonomy.js");

const VENUE_CHAT_MESSAGES_COUNTER_SHARDS_COUNT = 10;

// These represent all of our venue templates (they should remain alphabetically sorted, deprecated should be separate from the rest)
// @debt unify this with VenueTemplate in src/types/venues.ts + share the same code between frontend/backend
const VenueTemplate = {
  artcar: "artcar",
  artpiece: "artpiece",
  audience: "audience",
  auditorium: "auditorium",
  conversationspace: "conversationspace",
  embeddable: "embeddable",
  firebarrel: "firebarrel",
  friendship: "friendship",
  jazzbar: "jazzbar",
  partymap: "partymap",
  animatemap: "animatemap",
  performancevenue: "performancevenue",
  posterhall: "posterhall",
  posterpage: "posterpage",
  screeningroom: "screeningroom",
  themecamp: "themecamp",
  viewingwindow: "viewingwindow",
  zoomroom: "zoomroom",

  /**
   * @deprecated Legacy template removed, perhaps try VenueTemplate.partymap instead?
   */
  avatargrid: "avatargrid",

  /**
   * @deprecated Legacy template removed, perhaps try VenueTemplate.partymap instead?
   */
  preplaya: "preplaya",

  /**
   * @deprecated Legacy template removed, perhaps try VenueTemplate.partymap instead?
   */
  playa: "playa",
};

// @debt unify this with HAS_REACTIONS_TEMPLATES in src/settings.ts + share the same code between frontend/backend
const HAS_REACTIONS_TEMPLATES = [
  VenueTemplate.audience,
  VenueTemplate.jazzbar,
  VenueTemplate.auditorium,
];

// @debt unify this with DEFAULT_SHOW_REACTIONS / DEFAULT_SHOW_SHOUTOUTS / DEFAULT_ENABLE_JUKEBOX in src/settings.ts + share the same code between frontend/backend
const DEFAULT_SHOW_REACTIONS = true;
const DEFAULT_SHOW_SHOUTOUTS = true;
const DEFAULT_ENABLE_JUKEBOX = false;

const checkUserIsOwner = async (venueId, uid) => {
  await admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .get()
    .then(async (doc) => {
      if (!doc.exists) {
        throw new HttpsError("not-found", `Venue ${venueId} does not exist`);
      }
      const venue = doc.data();
      if (venue.owners && venue.owners.includes(uid)) return;

      if (venue.parentId) {
        const doc = await admin
          .firestore()
          .collection("venues")
          .doc(venue.parentId)
          .get();

        if (!doc.exists) {
          throw new HttpsError(
            "not-found",
            `Venue ${venueId} references missing parent ${venue.parentId}`
          );
        }
        const parentVenue = doc.data();
        if (!(parentVenue.owners && parentVenue.owners.includes(uid))) {
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
const checkIfUserHasVoted = async (venueId, pollId, userId) => {
  await admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection("chats")
    .doc(pollId)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        throw new HttpsError("not-found", `Poll ${pollId} does not exist`);
      }

      const poll = doc.data();

      return poll.votes.some(
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

// @debt this should be de-duplicated + aligned with createVenueData to ensure they both cover all needed cases
const createVenueData_v2 = (data, context) => {
  const venueData_v2 = {
    name: data.name,
    config: {
      ...(Array.isArray(data.tables) && { tables: data.tables }),
      landingPageConfig: {
        coverImageUrl: data.bannerImageUrl || "",
        subtitle: data.subtitle,
        description: data.description,
      },
    },
    host: {
      icon: data.logoImageUrl || "",
    },
    owners: [context.auth.token.user_id],
    showGrid: data.showGrid || false,
    ...(data.showGrid && { columns: data.columns }),
    template: data.template || VenueTemplate.partymap,
    rooms: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    parentId: data.parentId || "",
    worldId: data.worldId,
    slug: data.slug,
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
const createBaseUpdateVenueData = (data, doc) => {
  const updated = doc.data();

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

  if (data.entrance) {
    updated.entrance = data.entrance;
  }

  if (data.mapBackgroundImageUrl) {
    updated.mapBackgroundImageUrl = data.mapBackgroundImageUrl;
  }

  if (data.roomVisibility) {
    updated.roomVisibility = data.roomVisibility;
  }

  if (typeof data.parentId === "string") {
    updated.parentId = data.parentId;
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

  updated.autoPlay = data.autoPlay !== undefined ? data.autoPlay : false;
  updated.updatedAt = Date.now();

  return updated;
};

const initializeVenueChatMessagesCounter = (venueRef, batch) => {
  const counterCollection = venueRef.collection("chatMessagesCounter");
  for (
    let shardId = 0;
    shardId < VENUE_CHAT_MESSAGES_COUNTER_SHARDS_COUNT;
    shardId++
  ) {
    batch.set(counterCollection.doc(shardId.toString()), { count: 0 });
  }
  batch.set(counterCollection.doc("sum"), { value: 0 });
};

exports.setAuditoriumSections = functions.https.onCall(
  async (data, context) => {
    checkAuth(context);

    const { venueId, numberOfSections } = data;

    await checkUserIsOwner(venueId, context.auth.token.user_id);

    const batch = admin.firestore().batch();

    const { docs: sections } = await admin
      .firestore()
      .collection("venues")
      .doc(venueId)
      .collection("sections")
      .get();

    const currentNumberOfSections = sections.length;

    // Adding sections if needed
    const numberOfSectionsToAdd = numberOfSections - currentNumberOfSections;
    for (let i = 1; i <= numberOfSectionsToAdd; i++) {
      const sectionRef = admin
        .firestore()
        .collection("venues")
        .doc(venueId)
        .collection("sections")
        .doc();

      batch.set(sectionRef, { isVip: false });
    }

    // Removing sections if needed
    const numberOfSectionsToRemove = -1 * numberOfSectionsToAdd;
    for (let i = 1; i <= numberOfSectionsToRemove; i++) {
      // to remove subcollection seatedSectionUsers we need to remove all its objects
      const batchForSections = admin.firestore().batch();
      const sectionId = sections[currentNumberOfSections - i].id;
      admin
        .firestore()
        .collection("venues")
        .doc(venueId)
        .collection("sections")
        .doc(sectionId)
        .collection("seatedSectionUsers")
        .listDocuments()
        .then((array) => {
          array.map((userDoc) => batchForSections.delete(userDoc));
          return batchForSections.commit();
        })
        .catch((e) => {
          throw e;
        });

      // remove section object
      batch.delete(sections[currentNumberOfSections - i].ref);
    }

    await batch.commit();
  }
);

exports.addVenueOwner = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const { venueId, newOwnerId } = data;

  await checkUserIsOwner(venueId, context.auth.token.user_id);

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

exports.removeVenueOwner = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const { venueId, ownerId } = data;
  await checkUserIsOwner(venueId, context.auth.token.user_id);

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
});

// @debt this should be de-duplicated + aligned with createVenue to ensure they both cover all needed cases
exports.createVenue_v2 = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const batch = admin.firestore().batch();

  const venueRef = admin.firestore().collection("venues").doc();
  const venuesRef = await admin
    .firestore()
    .collection("venues")
    .where("slug", "==", data.slug)
    .where("worldId", "==", data.worldId)
    .get();
  const venueExists = venuesRef.docs.length;

  if (venueExists) {
    throw new HttpsError(
      "already-exists",
      `The slug ${data.slug} is already taken by a space within the world. Please try another.`
    );
  }

  const venueData = createVenueData_v2(data, context);
  batch.create(venueRef, venueData);
  initializeVenueChatMessagesCounter(venueRef, batch);

  await batch.commit();

  return venueData;
});

exports.upsertRoom = functions.https.onCall(async (data, context) => {
  checkAuth(context);
  const { venueId, roomIndex, room } = data;
  await checkUserIsOwner(venueId, context.auth.token.user_id);
  const doc = await admin.firestore().collection("venues").doc(venueId).get();

  if (!doc || !doc.exists) {
    throw new HttpsError("not-found", `Venue ${venueId} not found`);
  }
  const docData = doc.data();
  let rooms = docData.rooms;

  if (typeof roomIndex !== "number") {
    rooms = [...rooms, room];
  } else {
    rooms[roomIndex] = room;
  }

  admin.firestore().collection("venues").doc(venueId).update({ rooms });
});

exports.deleteRoom = functions.https.onCall(async (data, context) => {
  checkAuth(context);
  const { venueId, room } = data;
  await checkUserIsOwner(venueId, context.auth.token.user_id);
  const doc = await admin.firestore().collection("venues").doc(venueId).get();

  if (!doc || !doc.exists) {
    throw new HttpsError("not-found", `Venue ${venueId} not found`);
  }
  const docData = doc.data();
  const rooms = docData.rooms;

  //if the room exists under the same name, find it
  const index = rooms.findIndex((val) => val.title === room.title);
  if (index === -1) {
    throw new HttpsError("not-found", `${ROOM_TAXON.capital} does not exist`);
  } else {
    docData.rooms.splice(index, 1);
  }

  admin.firestore().collection("venues").doc(venueId).update(docData);
});

// @debt this is almost a line for line duplicate of exports.updateVenue, we should de-duplicate/DRY these up
exports.updateVenue_v2 = functions.https.onCall(async (data, context) => {
  const venueId = data.id;
  checkAuth(context);

  // @debt updateVenue uses checkUserIsOwner rather than checkUserIsAdminOrOwner. Should these be the same? Which is correct?
  await checkUserIsOwner(venueId, context.auth.token.user_id);

  if (!data.worldId) {
    throw new HttpsError(
      "not-found",
      "World Id is missing and the update can not be executed."
    );
  }

  // @debt We should validate venueId conforms to our valid patterns before attempting to use it in a query
  const doc = await admin.firestore().collection("venues").doc(venueId).get();

  // @debt this is exactly the same as in updateVenue
  if (!doc || !doc.exists) {
    throw new HttpsError("not-found", `Venue ${venueId} not found`);
  }

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

  // @debt aside from the data.radioStations part, this is exactly the same as in updateVenue
  if (typeof data.showRadio === "boolean") {
    updated.showRadio = data.showRadio;
    // @debt the logic here differs from updateVenue, as data.radioStations is always set when present there
    updated.radioStations = [data.radioStations];
  }

  // @debt this is exactly the same as in updateVenue
  const venuesRef = await admin
    .firestore()
    .collection("venues")
    .where("slug", "==", data.slug)
    .where("worldId", "==", data.worldId)
    .get();

  const venueRef = venuesRef.docs && venuesRef.docs[0];

  if (venueRef) {
    await venueRef.ref.update(updated);
  }
});

exports.updateMapBackground = functions.https.onCall(async (data, context) => {
  const venueId = data.id;
  checkAuth(context);

  await checkUserIsOwner(venueId, context.auth.token.user_id);

  if (!data.worldId) {
    throw new HttpsError(
      "not-found",
      "World Id is missing and the update can not be executed."
    );
  }

  const venuesRef = await admin
    .firestore()
    .collection("venues")
    .where("slug", "==", data.slug)
    .where("worldId", "==", data.worldId)
    .get();

  const venueRef = venuesRef.docs && venuesRef.docs[0];

  if (venueRef) {
    await venueRef.ref.update({
      mapBackgroundImageUrl: data.mapBackgroundImageUrl,
    });
  }
});

exports.updateVenueNG = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  // @debt updateVenue uses checkUserIsOwner rather than checkUserIsAdminOrOwner. Should these be the same? Which is correct?
  await checkUserIsOwner(data.id, context.auth.token.user_id);

  if (!data.worldId) {
    throw new HttpsError(
      "not-found",
      "World Id is missing and the update can not be executed."
    );
  }

  const updated = {
    config: {
      landingPageConfig: {},
    },
  };

  updated.updatedAt = Date.now();

  if (data.subtitle || data.subtitle === "") {
    updated.config.landingPageConfig.subtitle = data.subtitle;
  }

  if (data.name) {
    updated.name = data.name;
  }

  if (data.description || data.description === "") {
    updated.config.landingPageConfig.description =
      data.description && data.description.text;
  }

  if (data.logoImageUrl) {
    if (!updated.host) {
      updated.host = {};
    }
    updated.host.icon = data.logoImageUrl;
  }

  if (data.entrance) {
    updated.entrance = data.entrance;
  }

  if (typeof data.zoomUrl === "string") {
    updated.zoomUrl = data.zoomUrl;
  }

  if (typeof data.iframeUrl === "string") {
    updated.iframeUrl = data.iframeUrl;
  }

  if (typeof data.parentId === "string") {
    updated.parentId = data.parentId;
  }

  if (data.roomVisibility) {
    updated.roomVisibility = data.roomVisibility;
  }

  if (data.auditoriumColumns) {
    updated.auditoriumColumns = data.auditoriumColumns;
  }

  if (data.auditoriumRows) {
    updated.auditoriumRows = data.auditoriumRows;
  }

  if (typeof data.showRangers === "boolean") {
    updated.showRangers = data.showRangers;
  }

  if (typeof data.showReactions === "boolean") {
    updated.showReactions = data.showReactions;
  }

  if (typeof data.isReactionsMuted === "boolean") {
    updated.isReactionsMuted = data.isReactionsMuted;
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

  updated.autoPlay = data.autoPlay !== undefined ? data.autoPlay : false;

  if (data.bannerImageUrl) {
    updated.config.landingPageConfig.coverImageUrl = data.bannerImageUrl;
  }

  if (typeof data.showGrid === "boolean") {
    updated.showGrid = data.showGrid;
  }

  if (typeof data.columns === "number") {
    updated.columns = data.columns;
  }

  if (typeof data.showRadio === "boolean") {
    updated.showRadio = data.showRadio;
  }

  if (data.radioStations) {
    updated.radioStations = [data.radioStations];
  }

  if (data.mapBackgroundImageUrl) {
    updated.mapBackgroundImageUrl = data.mapBackgroundImageUrl;
  }

  // @debt perhaps await is more appropriate in front of admin so the function will return the error
  admin
    .firestore()
    .collection("venues")
    .doc(data.id)
    .set(updated, { merge: true })
    .catch((e) => console.error(exports.updateVenueNG.name, e));
});

exports.updateTables = functions.https.onCall((data, context) => {
  checkAuth(context);

  const isValidVenueId = checkIfValidVenueId(data.venueId);

  if (!isValidVenueId) {
    throw new HttpsError("invalid-argument", `venueId is not a valid venue id`);
  }

  const spaceRef = admin.firestore().collection("venues").doc(data.venueId);

  return admin.firestore().runTransaction(async (transaction) => {
    const spaceDoc = await transaction.get(spaceRef);

    if (!spaceDoc.exists) {
      throw new HttpsError("not-found", `venue ${venueId} does not exist`);
    }

    const space = spaceDoc.data();

    const spaceTables =
      (space.config && space.config.tables) || data.defaultTables;

    const currentTableIndex = spaceTables.findIndex(
      (table) => table.reference === data.newTable.reference
    );

    if (currentTableIndex < 0) {
      spaceTables.push(data.newTable);
    } else {
      spaceTables[currentTableIndex] = data.newTable;
    }

    transaction.update(spaceRef, { "config.tables": spaceTables });
  });
});

exports.deleteTable = functions.https.onCall(async (data, context) => {
  checkAuth(context);
  const { venueId: spaceId, tableName, defaultTables } = data;
  await checkUserIsOwner(spaceId, context.auth.token.user_id);
  const doc = await admin.firestore().collection("venues").doc(spaceId).get();

  if (!doc || !doc.exists) {
    throw new HttpsError("not-found", `Venue ${spaceId} not found`);
  }

  const docData = doc.data();
  const tables = docData.config.tables || defaultTables;

  const index = tables.findIndex((val) => val.reference === tableName);

  if (index === -1) {
    throw new HttpsError("not-found", `Table does not exist`);
  }

  tables.splice(index, 1);

  admin
    .firestore()
    .collection("venues")
    .doc(spaceId)
    .update({
      ...docData,
      config: { ...docData.config, tables },
    });
});

exports.deleteVenue = functions.https.onCall(async (data, context) => {
  const venueId = data.id;
  checkAuth(context);

  await checkUserIsOwner(venueId, context.auth.token.user_id);

  admin.firestore().collection("venues").doc(venueId).delete();
});

// @debt extract this into a new functions/chat backend script file
exports.voteInPoll = functions.https.onCall(
  async ({ venueId, pollVote }, context) => {
    checkAuth(context);

    const { pollId, questionId } = pollVote;

    try {
      await checkIfUserHasVoted(venueId, pollId, context.auth.token.user_id);

      const newVote = {
        questionId,
        userId: context.auth.token.user_id,
      };

      admin
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
        "has-voted",
        `User ${userId} has voted in ${pollId} Poll`,
        error
      );
    }
  }
);

exports.adminUpdateBannerMessage = functions.https.onCall(
  async (data, context) => {
    await checkUserIsOwner(data.venueId, context.auth.token.user_id);
    await admin
      .firestore()
      .collection("venues")
      .doc(data.venueId)
      .update({ banner: data.banner || null });
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

exports.setVenueLiveStatus = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  const isValidVenueId = checkIfValidVenueId(data.venueId);

  if (!isValidVenueId) {
    throw new HttpsError("invalid-argument", `venueId is not a valid venue id`);
  }

  if (typeof data.isLive !== "boolean") {
    throw new HttpsError("invalid-argument", `isLive is not a boolean`);
  }

  const update = {
    isLive: Boolean(data.isLive),
  };

  await admin.firestore().collection("venues").doc(data.venueId).update(update);
});

exports.upsertScreeningRoomVideo = functions.https.onCall(
  async (data, context) => {
    const { spaceId, video, videoId } = data;

    await checkUserIsOwner(spaceId, context.auth.token.user_id);

    const videosCollection = await admin
      .firestore()
      .collection("venues")
      .doc(spaceId)
      .collection("screeningRoomVideos");

    if (videoId) {
      await videosCollection.doc(videoId).set(video);
    } else {
      await videosCollection.doc().set(video);
    }
  }
);

exports.deleteScreeningRoomVideo = functions.https.onCall(
  async (data, context) => {
    const { spaceId, videoId } = data;

    await checkUserIsOwner(spaceId, context.auth.token.user_id);

    await admin
      .firestore()
      .collection("venues")
      .doc(spaceId)
      .collection("screeningRoomVideos")
      .doc(videoId)
      .delete();
  }
);
