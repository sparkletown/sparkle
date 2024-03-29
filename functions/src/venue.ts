import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/v1/https";

import { addAdmin, removeAdmin } from "./api/roles";
import { LandingPageConfig } from "./types/venue";
import { assertValidAuth } from "./utils/assert";
import { throwErrorIfNotWorldOwner } from "./utils/permissions";
import { checkIfValidVenueId, getSpaceById } from "./utils/venue";
import { ROOM_TAXON } from "./taxonomy";

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
  performancevenue: "performancevenue",
  posterhall: "posterhall",
  posterpage: "posterpage",
  screeningroom: "screeningroom",
  themecamp: "themecamp",
  zoomroom: "zoomroom",

  /**
   * @deprecated Legacy template removed, perhaps try VenueTemplate.partymap instead?
   */
  avatargrid: "avatargrid",
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
      if (!doc.exists) {
        throw new HttpsError("not-found", `Poll ${pollId} does not exist`);
      }

      const poll = doc.data();

      if (!poll) {
        throw new HttpsError("internal", "No data returned");
      }

      return poll.votes.some(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

// @debt this should be moved to a shared types file
interface VenueData2Payload {
  name: string;

  tables: string[];

  bannerImageUrl?: string;

  subtitle: string;

  description: string;

  logoImageUrl?: string;

  template?: string;

  parentId?: string;

  worldId: string;

  slug: string;

  enableJukebox?: boolean;

  showReactions?: boolean;

  showShoutouts?: boolean;
}

interface CreateVenueData2 {
  enableJukebox?: boolean;

  showReactions?: boolean;

  showShoutouts?: boolean;

  template: string;

  rooms: string[];

  createdAt: number;

  updatedAt: number;

  parentId?: string;
  worldId: string;

  slug: string;

  name: string;

  config: {
    landingPageConfig: LandingPageConfig;
  };
  host: {
    icon?: string;
  };
  owners: string[];

  isHidden: boolean;
  boothsEnabled: boolean;
  maxBooths: number;
}

// @debt this should be de-duplicated + aligned with createVenueData to ensure they both cover all needed cases
const createVenueData_v2 = (data: VenueData2Payload, context: Object) => {
  const venueData_v2: CreateVenueData2 = {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    owners: [context.auth.token.user_id],
    template: data.template || VenueTemplate.partymap,
    rooms: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    parentId: data.parentId || "",
    worldId: data.worldId,
    slug: data.slug,
    isHidden: false,
    boothsEnabled: false,
    maxBooths: 1,
  };

  if (data.template === VenueTemplate.jazzbar) {
    venueData_v2.enableJukebox =
      typeof data.enableJukebox === "boolean"
        ? data.enableJukebox
        : DEFAULT_ENABLE_JUKEBOX;
  }

  if (data.template && HAS_REACTIONS_TEMPLATES.includes(data.template)) {
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

interface CreateBaseUpdateVenueDataPayload {
  subtitle: string;
  description: string;
  primaryColor?: string;
  logoImageUrl?: string;
  entrance?: string;
  backgroundImageUrl?: string;
  mapBackgroundImageUrl?: string;
  roomVisibility?: string;
  parentId?: string;
  showReactions?: boolean;
  enableJukebox?: boolean;
  showUserStatus?: boolean;
  showShoutouts?: boolean;
  userStatuses?: string[];
  autoPlay?: boolean;
}

interface Venue {
  id: string;
  worldId: string;
  slug: string;
  name: string;
  start_utc_seconds?: number;
  end_utc_seconds?: number;
  showRadio?: boolean;
  radioStations: string[];
  entrance?: string;
  backgroundImageUrl?: string;
  mapBackgroundImageUrl?: string;
  roomVisibility?: string;
  parentId?: string;
  showReactions?: boolean;
  enableJukebox?: boolean;
  showContent?: boolean;
  showUserStatus?: boolean;
  showShoutouts?: boolean;
  userStatuses?: string[];
  autoPlay?: boolean;
  updatedAt: number;
  zoomUrl?: string;
  iframeUrl?: string;
  showRangers?: boolean;
  isReactionsMuted?: boolean;
  boothsEnabled?: boolean;
  maxBooths?: number;
  boothTemplateSpaceId?: string;

  config: {
    landingPageConfig: LandingPageConfig;
  };
  theme: {
    primaryColor?: string;
  };
  host: {
    icon?: string;
  };
}

// @debt refactor function so it doesn't mutate the passed in updated object, but efficiently returns an updated one instead
const createBaseUpdateVenueData = (
  data: CreateBaseUpdateVenueDataPayload,
  doc: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>
) => {
  const updated: Venue = doc.data() as Venue;

  if (!updated) {
    throw new HttpsError("internal", "No data returned");
  }

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

  if (data.backgroundImageUrl) {
    updated.backgroundImageUrl = data.backgroundImageUrl;
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

const initializeVenueChatMessagesCounter = (
  venueRef: admin.firestore.DocumentReference<admin.firestore.DocumentData>,
  batch: admin.firestore.WriteBatch
) => {
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

export const setAuditoriumSections = functions.https.onCall(
  async (data, context) => {
    assertValidAuth(context);

    const { venueId, numberOfSections } = data;

    const space = await getSpaceById(venueId);

    await throwErrorIfNotWorldOwner({
      worldId: space.worldId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userId: context.auth.token.user_id,
    });

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
      batch.delete(sections[currentNumberOfSections - i].ref);
    }

    await batch.commit();
  }
);

export const addSpaceOwnerBulk = functions.https.onCall(
  async (data, context) => {
    assertValidAuth(context);

    const { addedSpacesIds, removedSpacesIds, newOwnerId, worldId } = data;

    await throwErrorIfNotWorldOwner({
      worldId: worldId,
      userId: context.auth?.token.user_id,
    });

    const addRequests = addedSpacesIds.map(async (spaceId: string) => {
      return await admin
        .firestore()
        .collection("venues")
        .doc(spaceId)
        .update({
          owners: admin.firestore.FieldValue.arrayUnion(newOwnerId),
        });
    });

    const removeRequests = removedSpacesIds.map(async (spaceId: string) => {
      return await admin
        .firestore()
        .collection("venues")
        .doc(spaceId)
        .update({
          owners: admin.firestore.FieldValue.arrayRemove(newOwnerId),
        });
    });

    await Promise.all([...addRequests, ...removeRequests]);
  }
);

export const addVenueOwner = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  const { venueId, newOwnerId } = data;

  const space = await getSpaceById(venueId);

  await throwErrorIfNotWorldOwner({
    worldId: space.worldId,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    userId: context.auth.token.user_id,
  });

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

    const space = await getSpaceById(venueId);

    await throwErrorIfNotWorldOwner({
      worldId: space.worldId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userId: context.auth.token.user_id,
    });

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

// @debt this should be de-duplicated + aligned with createVenue to ensure they both cover all needed cases
export const createVenue_v2 = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

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

export const upsertRoom = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  const { venueId, roomIndex, room } = data;

  const space = await getSpaceById(venueId);

  await throwErrorIfNotWorldOwner({
    worldId: space.worldId,
    userId: context.auth?.token.user_id,
  });

  const doc = await admin.firestore().collection("venues").doc(venueId).get();

  if (!doc || !doc.exists) {
    throw new HttpsError("not-found", `Venue ${venueId} not found`);
  }
  const docData = doc.data();
  if (!docData) {
    throw new HttpsError("internal", `Data not found`);
  }

  let rooms = docData.rooms;

  if (typeof roomIndex !== "number") {
    rooms = [...rooms, room];
  } else {
    rooms[roomIndex] = room;
  }

  admin.firestore().collection("venues").doc(venueId).update({ rooms });
});

export const deletePortal = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  const { spaceId, portal } = data;

  const space = await getSpaceById(spaceId);

  await throwErrorIfNotWorldOwner({
    worldId: space.worldId,
    userId: context.auth?.token.user_id,
  });

  const doc = await admin.firestore().collection("venues").doc(spaceId).get();

  if (!doc || !doc.exists) {
    throw new HttpsError("not-found", `Venue ${spaceId} not found`);
  }
  const docData = doc.data();
  if (!docData) {
    throw new HttpsError("not-found", "Data not found");
  }

  const portals = docData.rooms;

  //if the room exists under the same name, find it
  const index = portals.findIndex(
    (val: { title: string }) => val.title === portal.title
  );

  if (index === -1) {
    throw new HttpsError("not-found", `${ROOM_TAXON.capital} does not exist`);
  } else {
    docData.rooms.splice(index, 1);
  }

  doc.ref.update(docData);
});

// @debt this is almost a line for line duplicate of exports.updateVenue, we should de-duplicate/DRY these up
export const updateVenue_v2 = functions.https.onCall(async (data, context) => {
  const venueId = data.id;

  assertValidAuth(context);

  const space = await getSpaceById(venueId);

  await throwErrorIfNotWorldOwner({
    worldId: space.worldId,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    userId: context.auth.token.user_id,
  });

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

export const updateMapBackground = functions.https.onCall(
  async (data, context) => {
    const venueId = data.id;

    assertValidAuth(context);

    const space = await getSpaceById(venueId);

    await throwErrorIfNotWorldOwner({
      worldId: space.worldId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userId: context.auth.token.user_id,
    });

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
  }
);

export const updateVenueNG = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  const spaceId = data.id;

  const space = await getSpaceById(spaceId);

  await throwErrorIfNotWorldOwner({
    worldId: space.worldId,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    userId: context.auth.token.user_id,
  });

  if (!data.worldId) {
    throw new HttpsError(
      "not-found",
      "World Id is missing and the update can not be executed."
    );
  }

  const updated: Partial<Venue> = {
    config: {
      landingPageConfig: {},
    },
  };

  updated.updatedAt = Date.now();

  if (data.subtitle || data.subtitle === "") {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    updated.config.landingPageConfig.subtitle = data.subtitle;
  }

  if (data.name) {
    updated.name = data.name;
  }

  if (data.description || data.description === "") {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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

  if (typeof data.showContent === "boolean") {
    updated.showContent = data.showContent;
  }

  if (typeof data.boothsEnabled === "boolean") {
    updated.boothsEnabled = data.boothsEnabled;
  }

  if (typeof data.maxBooths === "number") {
    updated.maxBooths = data.maxBooths;
  }

  if (typeof data.boothTemplateSpaceId === "string") {
    updated.boothTemplateSpaceId = data.boothTemplateSpaceId;
  }

  if (data.userStatuses) {
    updated.userStatuses = data.userStatuses;
  }

  updated.autoPlay = data.autoPlay !== undefined ? data.autoPlay : false;

  if (data.bannerImageUrl) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    updated.config.landingPageConfig.coverImageUrl = data.bannerImageUrl;
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

  if (data.backgroundImageUrl) {
    updated.backgroundImageUrl = data.backgroundImageUrl;
  }

  // @debt perhaps await is more appropriate in front of admin so the function will return the error
  admin
    .firestore()
    .collection("venues")
    .doc(data.id)
    .set(updated, { merge: true })
    .catch((e) => console.error(exports.updateVenueNG.name, e));
});

export const updateTables = functions.https.onCall((data, context) => {
  assertValidAuth(context);

  const isValidVenueId = checkIfValidVenueId(data.venueId);

  if (!isValidVenueId) {
    throw new HttpsError("invalid-argument", `venueId is not a valid venue id`);
  }

  const spaceRef = admin.firestore().collection("venues").doc(data.venueId);

  return admin.firestore().runTransaction(async (transaction) => {
    const spaceDoc = await transaction.get(spaceRef);

    if (!spaceDoc.exists) {
      throw new HttpsError("not-found", `venue ${data.venueId} does not exist`);
    }

    const space = spaceDoc.data();
    if (!space) {
      throw new HttpsError("internal", "data not found");
    }

    const spaceTables =
      (space.config && space.config.tables) || data.defaultTables;

    const currentTableIndex = spaceTables.findIndex(
      (table: { reference: string }) =>
        table.reference === data.newTable.reference
    );

    if (currentTableIndex < 0) {
      spaceTables.push(data.newTable);
    } else {
      spaceTables[currentTableIndex] = data.newTable;
    }

    transaction.update(spaceRef, { "config.tables": spaceTables });
  });
});

export const deleteTable = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  const { venueId: spaceId, tableName, defaultTables } = data;

  const space = await getSpaceById(spaceId);

  await throwErrorIfNotWorldOwner({
    worldId: space.worldId,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    userId: context.auth.token.user_id,
  });

  const doc = await admin.firestore().collection("venues").doc(spaceId).get();

  if (!doc || !doc.exists) {
    throw new HttpsError("not-found", `Venue ${spaceId} not found`);
  }

  const docData = doc.data();

  if (!docData) {
    throw new HttpsError("internal", "data not found");
  }
  const tables = docData.config.tables || defaultTables;

  const index = tables.findIndex(
    (val: { reference: string }) => val.reference === tableName
  );

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

export const deleteVenue = functions.https.onCall(async (data, context) => {
  const venueId = data.id;

  assertValidAuth(context);

  const space = await getSpaceById(venueId);

  await throwErrorIfNotWorldOwner({
    worldId: space.worldId,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    userId: context.auth.token.user_id,
  });

  admin.firestore().collection("venues").doc(venueId).delete();
});

// @debt extract this into a new functions/chat backend script file
export const voteInPoll = functions.https.onCall(
  async ({ venueId, pollVote }, context) => {
    assertValidAuth(context);

    const { pollId, questionId } = pollVote;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId: string = context.auth.token.user_id;

    try {
      await checkIfUserHasVoted(venueId, pollId, userId);

      const newVote = {
        questionId,
        userId,
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
        "unavailable",
        `User ${userId} has voted in ${pollId} Poll`,
        error
      );
    }
  }
);

export const adminUpdateBannerMessage = functions.https.onCall(
  async (data, context) => {
    const venueId = data.venueId;

    const space = await getSpaceById(venueId);

    await throwErrorIfNotWorldOwner({
      worldId: space.worldId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userId: context.auth.token.user_id,
    });

    await admin
      .firestore()
      .collection("venues")
      .doc(venueId)
      .update({ banner: data.banner || null });
  }
);

export const adminUpdateIframeUrl = functions.https.onCall(
  async (data, context) => {
    const { venueId, iframeUrl } = data;

    const space = await getSpaceById(venueId);

    await throwErrorIfNotWorldOwner({
      worldId: space.worldId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userId: context.auth.token.user_id,
    });

    await admin
      .firestore()
      .collection("venues")
      .doc(venueId)
      .update({ iframeUrl: iframeUrl || null });
  }
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

export const upsertScreeningRoomVideo = functions.https.onCall(
  async (data, context) => {
    const { spaceId, video, videoId } = data;

    const space = await getSpaceById(spaceId);

    await throwErrorIfNotWorldOwner({
      worldId: space.worldId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userId: context.auth.token.user_id,
    });

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

export const deleteScreeningRoomVideo = functions.https.onCall(
  async (data, context) => {
    const { spaceId, videoId } = data;

    const space = await getSpaceById(spaceId);

    await throwErrorIfNotWorldOwner({
      worldId: space.worldId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userId: context.auth.token.user_id,
    });

    await admin
      .firestore()
      .collection("venues")
      .doc(spaceId)
      .collection("screeningRoomVideos")
      .doc(videoId)
      .delete();
  }
);

export const upsertChannel = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  const { spaceId, channelIndex, channel } = data;

  const space = await getSpaceById(spaceId);

  await throwErrorIfNotWorldOwner({
    worldId: space.worldId,
    userId: context.auth?.token.user_id,
  });

  let channels = space.channels || [];

  if (typeof channelIndex !== "number") {
    channels = [...channels, channel];
  } else {
    channels[channelIndex] = channel;
  }

  admin.firestore().collection("venues").doc(spaceId).update({ channels });
});

export const deleteChannel = functions.https.onCall(async (data, context) => {
  const { spaceId, channelIndex } = data;

  const space = await getSpaceById(spaceId);

  await throwErrorIfNotWorldOwner({
    worldId: space.worldId,
    userId: context.auth?.token.user_id,
  });

  const channels = space.channels || [];

  channels.splice(channelIndex, 1);

  admin.firestore().collection("venues").doc(spaceId).update({ channels });
});

const generateNameForBooth = async (parentSpaceId: string) => {
  // Finds a name for the booth that isn't already taken inside the parent
  // space. Starts at 1 and keeps going until a free number is found
  const collection = admin.firestore().collection("venues");
  const existingBooths = (
    await collection
      .where("parentId", "==", parentSpaceId)
      .where("isHidden", "==", false)
      .get()
  ).docs;

  for (let i = 1; i <= existingBooths.length; i++) {
    const possibleName = `Meeting Room ${i}`;
    const matchingBooth = existingBooths.find(
      (doc) => doc.data().name === possibleName
    );
    if (matchingBooth) {
      continue;
    }

    return possibleName;
  }

  return `Booth ${existingBooths.length + 1}`;
};

interface CreateBoothOptions {
  templateSpaceId?: string;
  parentSpaceId: string;
}

export const createBooth = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  const options = data as CreateBoothOptions;

  const batch = admin.firestore().batch();
  const collection = admin.firestore().collection("venues");

  const parentSpace = (
    await collection.doc(options.parentSpaceId).get()
  ).data();

  if (!parentSpace) {
    throw new HttpsError(
      "not-found",
      `The parent space ${options.parentSpaceId} does not exist`
    );
  }

  const templateSpace = options.templateSpaceId
    ? (await collection.doc(options.templateSpaceId).get()).data()
    : undefined;

  const name = await generateNameForBooth(options.parentSpaceId);
  const venueRef = admin.firestore().collection("venues").doc();
  const slug = `booth-${venueRef.id}`;

  // TODO This code around creating venues should be refactored. There's a lot
  // of debt in this area
  const standardVenueData = createVenueData_v2(
    {
      name,
      slug,
      tables: [],
      bannerImageUrl: templateSpace?.config.landingPageConfig.coverImageUrl,
      subtitle: templateSpace?.config.landingPageConfig.subtitle || "",
      description: templateSpace?.config.landingPageConfig.description || "",
      logoImageUrl: templateSpace?.host.icon,
      template: "meetingroom",
      parentId: options.parentSpaceId,
      worldId: parentSpace.worldId,
    },
    context
  );

  const venueData = {
    ...standardVenueData,
    managedBy: options.parentSpaceId,
    backgroundImageUrl: templateSpace?.backgroundImageUrl || "",
    channels: templateSpace?.channels || [],
  };

  batch.create(venueRef, venueData);

  initializeVenueChatMessagesCounter(venueRef, batch);

  await batch.commit();

  return { id: venueRef.id, slug };
});

interface PosterDetails {
  name: string;
  thumbnailUrl: string;
  description: string;
  embedUrl: string;
  // The poster ID is used to identify poster rooms from previous uploads and
  // update them rather than continuously create new ones
  posterId: string;
}

interface UpdatePosterOptions {
  ownerSpaceId: string;
  posterDetails: PosterDetails[];
}

const POSTER_CREATED = "created";
const POSTER_UPDATED = "updated";
const POSTER_DELETED = "deleted";

const updatePoster = async (
  batch: admin.firestore.WriteBatch,
  context: functions.https.CallableContext,
  ownerSpace: Venue,
  posterDetails: PosterDetails
) => {
  console.log("Updating poster", JSON.stringify(posterDetails));
  // Get the existing space for this poster if it exists
  const existingRef = await admin
    .firestore()
    .collection("venues")
    .where("managedBy", "==", ownerSpace.id)
    .where("poster.posterId", "==", posterDetails.posterId)
    .get();
  const [existing] = existingRef.docs;

  if (!existing) {
    // Poster doesn't exist so create it
    const venueRef = admin.firestore().collection("venues").doc();
    const slug = `${ownerSpace.slug}-${venueRef.id}`;

    // TODO This code around creating venues should be refactored. There's a lot
    // of debt in this area
    const standardVenueData = createVenueData_v2(
      {
        name: posterDetails.name,
        slug,
        tables: [],
        subtitle: "",
        description: posterDetails.description,
        template: "posterpage",
        parentId: ownerSpace.id,
        worldId: ownerSpace.worldId,
      },
      context
    );

    const venueData = {
      ...standardVenueData,
      managedBy: ownerSpace.id,
      backgroundImageUrl: "",
      iframeUrl: posterDetails.embedUrl,
      poster: {
        thumbnailUrl: posterDetails.thumbnailUrl,
        posterId: posterDetails.posterId,
      },
    };
    batch.create(venueRef, venueData);

    initializeVenueChatMessagesCounter(venueRef, batch);

    return POSTER_CREATED;
  } else {
    console.log("updating", existing.id);
    batch.update(existing.ref, {
      name: posterDetails.name,
      description: posterDetails.description,
      iframeUrl: posterDetails.embedUrl,
      poster: {
        thumbnailUrl: posterDetails.thumbnailUrl,
        posterId: posterDetails.posterId,
      },
      // Unhide the poster, in case the poster was hidden on a previous run
      isHidden: false,
    });
    return POSTER_UPDATED;
  }
};

export const updatePosters = functions.https.onCall(async (data, context) => {
  assertValidAuth(context);

  const options = data as UpdatePosterOptions;

  const collection = admin.firestore().collection("venues");

  const { ownerSpaceId, posterDetails } = options;
  const ownerSpace = (await collection.doc(ownerSpaceId).get()).data();

  if (!ownerSpace) {
    throw new HttpsError(
      "not-found",
      `The template ${options.ownerSpaceId} does not exist`
    );
  }

  // Copy the ID into the space as it isn't automatically set
  ownerSpace.id = ownerSpaceId;

  const batch = admin.firestore().batch();

  const results = await Promise.all(
    posterDetails.map((poster) =>
      updatePoster(batch, context, ownerSpace as Venue, poster)
    )
  );
  const counts = results.reduce(
    (acc, result) => {
      acc[result] += 1;
      return acc;
    },
    { [POSTER_CREATED]: 0, [POSTER_UPDATED]: 0, [POSTER_DELETED]: 0 }
  );

  // Find all the posters that need deleting
  const existingPosters = await admin
    .firestore()
    .collection("venues")
    .where("managedBy", "==", ownerSpace.id)
    .where("isHidden", "==", false)
    .get();
  const uploadedPosterIds = posterDetails.map(({ posterId }) => posterId);

  existingPosters.docs.forEach((doc) => {
    const data = doc.data();
    const posterId = data?.poster?.posterId;
    const existing = uploadedPosterIds.findIndex(
      (candidate) => candidate === posterId
    );
    if (existing === -1) {
      console.log(`Hiding poster ${doc.id} (${posterId}) as not uploaded`);
      batch.update(doc.ref, { isHidden: true });
      counts[POSTER_DELETED] += 1;
    }
  });

  await batch.commit();

  return counts;
});
