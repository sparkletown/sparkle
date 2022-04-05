import Bugsnag from "@bugsnag/js";
import { FIREBASE } from "core/firebase";
import firebase from "firebase/compat/app";
import { httpsCallable } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { omit } from "lodash";

import {
  ACCEPTED_IMAGE_TYPES,
  COLLECTION_WORLD_EVENTS,
  DEFAULT_PORTAL_BOX,
  DEFAULT_SECTIONS_AMOUNT,
  DEFAULT_SHOW_REACTIONS,
  DEFAULT_SHOW_SHOUTOUTS,
  INVALID_SLUG_CHARS_REGEX,
} from "settings";

import { getUserRef } from "api/profile";
import { findSpaceBySlug } from "api/space";

import { SpaceId, SpaceSlug, UserId, WorldId } from "types/id";
import { PortalInput, Room, RoomInput } from "types/rooms";
import { ScreeningRoomVideo } from "types/screeningRoom";
import { SpaceType } from "types/spaces";
import { Table } from "types/Table";
import { User } from "types/User";
import {
  Channel,
  VenueAdvancedConfig,
  VenuePlacement,
  WorldEvent,
} from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { WithId, withId, WithoutId, WithWorldId } from "utils/id";
import { generateAttendeeInsideUrl } from "utils/url";

import { fetchVenue } from "./venue";
import { fetchWorld } from "./world";

export interface EventInput {
  space?: SpaceType;
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  duration_hours: number;
  duration_minutes?: number;
  host: string;
}

type ImageFileKeys =
  | "backgroundImageFile"
  | "logoImageFile"
  | "mapBackgroundImageFile";

type ImageUrlKeys =
  | "backgroundImageUrl"
  | "logoImageUrl"
  | "mapBackgroundImageUrl";

type RoomImageFileKeys = "image_file";
type RoomImageUrlKeys = "image_url";

type RoomImageUrls = Partial<Record<RoomImageUrlKeys, string>>;

export interface VenueInput_v2 extends WithId<VenueAdvancedConfig> {
  name: string;
  slug: SpaceSlug;
  description?: string;
  subtitle?: string;
  backgroundImageFile?: FileList;
  backgroundImageUrl?: string;
  logoImageFile?: FileList;
  logoImageUrl?: string;
  rooms?: Room[];
  mapBackgroundImageFile?: FileList;
  mapBackgroundImageUrl?: string;
  template?: VenueTemplate;
  iframeUrl?: string;
  autoPlay?: boolean;
  parentId?: SpaceId;
  start_utc_seconds?: number;
  end_utc_seconds?: number;
  showShoutouts?: boolean;
  showReactions?: boolean;
  tables?: Table[];
}

type FirestoreVenueInput_v2 = Omit<VenueInput_v2, ImageFileKeys> &
  Partial<Record<ImageUrlKeys, string>> & {
    template: VenueTemplate;
    parentId?: SpaceId;
  };

type FirestoreRoomInput = Omit<RoomInput, RoomImageFileKeys> & RoomImageUrls;

type FirestoreRoomInput_v2 = Omit<PortalInput, RoomImageFileKeys> &
  RoomImageUrls & {
    url?: string;
  };

export type PlacementInput = {
  addressText?: string;
  notes?: string;
  placement?: Omit<VenuePlacement, "state">;
  width: number;
  height: number;
};

export const createSlug = (name: string | unknown) =>
  String(name ?? "")
    .replace(INVALID_SLUG_CHARS_REGEX, "")
    .toLowerCase();

export const getVenueOwners = async (venueId: string): Promise<string[]> => {
  const owners = (
    await firebase.firestore().collection("venues").doc(venueId).get()
  ).data()?.owners;

  return owners;
};

/**
 * This method creates the payload for an API call for creating/updating venues.
 * It is only intended to be used in two places:
 *  * Creating a new venue (and so no ID is needed)
 *  * By createFirestoreVenueInputWithoutId_v2 which adds the venue ID
 */
const createFirestoreVenueInputWithoutId_v2 = async (
  input: Omit<VenueInput_v2, "id">,
  userId: UserId
) => {
  type ImageNaming = {
    fileKey: ImageFileKeys;
    urlKey: ImageUrlKeys;
  };

  const imageKeys: Array<ImageNaming> = [
    {
      fileKey: "logoImageFile",
      urlKey: "logoImageUrl",
    },
    {
      fileKey: "backgroundImageFile",
      urlKey: "backgroundImageUrl",
    },
    {
      fileKey: "mapBackgroundImageFile",
      urlKey: "mapBackgroundImageUrl",
    },
  ];

  let imageInputData = {};

  // upload the files
  for (const { fileKey, urlKey } of imageKeys) {
    const files = input[fileKey];
    const file = files?.[0];

    if (!file) continue;

    const type = file.type;
    if (!ACCEPTED_IMAGE_TYPES.includes(type)) continue;

    const fileExtension = file.type.split("/").pop();

    // @debt this may cause missing or wrong image issues if two venues exchange their slugs, should take multiple steps to reproduce
    const uploadFileRef = ref(
      FIREBASE.storage,
      `users/${userId}/venues/${input.slug}/${urlKey}.${fileExtension}`
    );

    await uploadBytes(uploadFileRef, file);
    const downloadUrl = await getDownloadURL(uploadFileRef);

    imageInputData = {
      ...imageInputData,
      [urlKey]: downloadUrl,
    };
  }

  const firestoreVenueInput: Omit<FirestoreVenueInput_v2, "id"> = {
    ...omit(
      input,
      imageKeys.map((entry) => entry.fileKey)
    ),
    ...imageInputData,
    template: input.template ?? VenueTemplate.partymap,
    parentId: input.parentId,
    // While name is used as URL slug and there is possibility cloud functions might miss this step, canonicalize before saving
    name: input.name,
    slug: input.slug,
  };
  return firestoreVenueInput;
};

const createFirestoreVenueInput_v2 = async (
  input: VenueInput_v2,
  userId: UserId
) => {
  // We temporarily cast the result to unknown so that we can cast to the
  // same type with the ID added, then we add the missing property.
  const result = ((await createFirestoreVenueInputWithoutId_v2(
    input,
    userId
  )) as unknown) as FirestoreVenueInput_v2;
  result.id = input.id;
  return result;
};

export const createVenue_v2 = async (
  // The default is for "doing something with a venue" to require a venue ID.
  // Creating a venue is a special case and doesn't want a venue ID.
  // This is preferred over having to remember to add "needs a venue ID" in
  // many places.
  input: WithWorldId<Omit<VenueInput_v2, "id">>,
  userId: UserId
) => {
  const firestoreVenueInput = await createFirestoreVenueInputWithoutId_v2(
    {
      ...input,
      showShoutouts: input.showShoutouts ?? DEFAULT_SHOW_SHOUTOUTS,
      showReactions: input.showReactions ?? DEFAULT_SHOW_REACTIONS,
      rooms: [],
    },
    userId
  );

  const worldId = input.worldId;
  const spaceSlug = firestoreVenueInput.slug;

  const venueResponse = httpsCallable(
    FIREBASE.functions,
    "venue-createVenue_v2"
  )({
    ...firestoreVenueInput,
    worldId,
  });

  const space = await findSpaceBySlug({
    spaceSlug,
    worldId,
  });

  if (input.template === VenueTemplate.auditorium) {
    await httpsCallable(
      FIREBASE.functions,
      "venue-setAuditoriumSections"
    )({
      venueId: space?.id,
      numberOfSections: DEFAULT_SECTIONS_AMOUNT,
    });
  }

  return venueResponse;
};

export const updateVenue_v2 = async (
  input: WithWorldId<VenueInput_v2>,
  userId: UserId
) => {
  const firestoreVenueInput = await createFirestoreVenueInput_v2(input, userId);

  return httpsCallable(
    FIREBASE.functions,
    "venue-updateVenue_v2"
  )(firestoreVenueInput).catch((error) => {
    const msg = `[updateVenue_v2] updating venue ${input.name}`;
    const context = {
      location: "api/admin::updateVenue_v2",
    };

    Bugsnag.notify(msg, (event) => {
      event.severity = "warning";
      event.addMetadata("context", context);
      event.addMetadata("firestoreVenueInput", firestoreVenueInput);
    });
    throw error;
  });
};

export const updateMapBackground = async (
  input: WithWorldId<VenueInput_v2>,
  userId: UserId
) => {
  const firestoreVenueInput = await createFirestoreVenueInput_v2(input, userId);

  return httpsCallable(
    FIREBASE.functions,
    "venue-updateMapBackground"
  )(firestoreVenueInput).catch((error) => {
    const msg = `[updateMapBackground] updating venue ${input.name}`;
    const context = {
      location: "api/admin::updateMapBackground",
    };

    Bugsnag.notify(msg, (event) => {
      event.severity = "warning";
      event.addMetadata("context", context);
      event.addMetadata("firestoreVenueInput", firestoreVenueInput);
    });
    throw error;
  });
};

const createFirestoreRoomInput = async (
  input: RoomInput,
  venueId: string,
  user: firebase.UserInfo
) => {
  const urlPortalName = createSlug(
    input.title + Math.random().toString() //room titles are not necessarily unique
  );

  let imageInputData = {};

  // upload the files
  if (input["image_file"]) {
    const fileArr = input["image_file"];
    const file = fileArr[0];
    const uploadFileRef = ref(
      FIREBASE.storage,
      `users/${user.uid}/venues/${venueId}/${urlPortalName}/${file.name}`
    );

    await uploadBytes(uploadFileRef, file);
    const downloadUrl = await getDownloadURL(uploadFileRef);
    imageInputData = { image_url: downloadUrl };
  } else {
    imageInputData = { image_url: input.image_url };
  }

  const firestoreRoomInput: FirestoreRoomInput = {
    ...omit(input, "image_file"),
    ...imageInputData,
  };
  return firestoreRoomInput;
};

const createFirestoreRoomInput_v2 = async (
  input: PortalInput,
  venueId: string,
  user: firebase.UserInfo
) => {
  const urlPortalName = createSlug(
    input.title + Math.random().toString() //room titles are not necessarily unique
  );
  type ImageNaming = {
    fileKey: RoomImageFileKeys;
    urlKey: RoomImageUrlKeys;
  };
  const imageKeys: Array<ImageNaming> = [
    {
      fileKey: "image_file",
      urlKey: "image_url",
    },
  ];

  let imageInputData = {};

  const venue = await fetchVenue(venueId);
  const world = await fetchWorld(venue.worldId);

  // upload the files
  for (const entry of imageKeys) {
    const fileArr = input[entry.fileKey];
    if (!fileArr || fileArr.length === 0) continue;
    const file = fileArr[0];
    const uploadFileRef = ref(
      FIREBASE.storage,
      `users/${user.uid}/venues/${venueId}/${urlPortalName}/${file.name}`
    );

    await uploadBytes(uploadFileRef, file);
    const downloadUrl = await getDownloadURL(uploadFileRef);
    imageInputData = { ...imageInputData, [entry.urlKey]: downloadUrl };
  }

  const firestoreRoomInput: FirestoreRoomInput_v2 = {
    ...omit(
      input,
      imageKeys.map((entry) => entry.fileKey)
    ),
    url:
      input.useUrl || !input.venueName
        ? input.url
        : window.origin +
          generateAttendeeInsideUrl({
            worldSlug: world.slug,
            spaceSlug: input.venueName as SpaceSlug,
          }),
    ...imageInputData,
  };

  return firestoreRoomInput;
};

export const upsertRoom = async (
  input: RoomInput,
  venueId: string,
  user: firebase.UserInfo,
  roomIndex?: number
) => {
  const firestoreVenueInput = await createFirestoreRoomInput(
    input,
    venueId,
    user
  );

  return await httpsCallable(
    FIREBASE.functions,
    "venue-upsertRoom"
  )({
    venueId,
    roomIndex,
    room: firestoreVenueInput,
  }).catch((e) => {
    Bugsnag.notify(e, (event) => {
      event.addMetadata("api/admin::upsertRoom", {
        venueId,
        roomIndex,
      });
    });
    throw e;
  });
};

export const deleteRoom = async (venueId: string, room: Room) => {
  return await httpsCallable(
    FIREBASE.functions,
    "venue-deleteRoom"
  )({
    venueId,
    room,
  }).catch((e) => {
    Bugsnag.notify(e, (event) => {
      event.addMetadata("api/admin::deleteRoom", {
        venueId,
        room,
      });
    });
    throw e;
  });
};

export const updateRoom = async (
  input: PortalInput,
  venueId: string,
  user: firebase.UserInfo,
  roomIndex: number
) => {
  const firestoreVenueInput = await createFirestoreRoomInput_v2(
    input,
    venueId,
    user
  );

  return await httpsCallable(
    FIREBASE.functions,
    "venue-upsertRoom"
  )({
    venueId,
    roomIndex,
    room: firestoreVenueInput,
  });
};

export const createRoom = async (
  input: PortalInput,
  venueId: string,
  user: firebase.UserInfo
) => {
  const firestoreVenueInput = await createFirestoreRoomInput_v2(
    input,
    venueId,
    user
  );

  return await httpsCallable(
    FIREBASE.functions,
    "venue-upsertRoom"
  )({
    venueId,
    room: {
      ...firestoreVenueInput,
      // Initial positions and size
      // TODO: As an alternative to the center positioning, maybe have a Math.random() to place rooms at random
      ...DEFAULT_PORTAL_BOX,
    },
  });
};

export const createEvent = async (event: WithoutId<WorldEvent>) => {
  await firebase.firestore().collection(COLLECTION_WORLD_EVENTS).add(event);
};

export const updateEvent = async (event: WorldEvent) => {
  await firebase
    .firestore()
    .doc(`${COLLECTION_WORLD_EVENTS}/${event.id}`)
    .update(event);
};

export const deleteEvent = async (event: WorldEvent) => {
  await firebase
    .firestore()
    .doc(`${COLLECTION_WORLD_EVENTS}/${event.id}`)
    .delete();
};

export const addVenueOwner = async (venueId: string, newOwnerId: string) =>
  await httpsCallable(
    FIREBASE.functions,
    "venue-addVenueOwner"
  )({
    venueId,
    newOwnerId,
  });

export const removeVenueOwner = async (venueId: string, ownerId: string) =>
  httpsCallable(
    FIREBASE.functions,
    "venue-removeVenueOwner"
  )({
    venueId,
    ownerId,
  });

export const addSpaceOwnerBulk = async (
  addedSpacesIds: SpaceId[],
  removedSpacesIds: SpaceId[],
  newOwnerId: UserId,
  worldId: WorldId
) =>
  await httpsCallable(
    FIREBASE.functions,
    "venue-addSpaceOwnerBulk"
  )({
    addedSpacesIds,
    removedSpacesIds,
    newOwnerId,
    worldId,
  });

export const upsertScreeningRoomVideo = async (
  video: ScreeningRoomVideo,
  spaceId: string,
  videoId?: string
) => {
  return await httpsCallable(
    FIREBASE.functions,
    "venue-upsertScreeningRoomVideo"
  )({
    video,
    videoId,
    spaceId,
  }).catch((e) => {
    Bugsnag.notify(e, (event) => {
      event.addMetadata("api/admin::upsertScreeningRoomVideo", {
        spaceId,
        video,
        videoId,
      });
    });
    throw e;
  });
};

export const deleteScreeningRoomVideo = async (
  videoId: string,
  spaceId: string
) => {
  return await httpsCallable(
    FIREBASE.functions,
    "venue-deleteScreeningRoomVideo"
  )({
    spaceId,
    videoId,
  }).catch((e) => {
    Bugsnag.notify(e, (event) => {
      event.addMetadata("api/admin::deleteScreeningRoomVideo", {
        videoId,
        spaceId,
      });
    });
    throw e;
  });
};

export const getSpaceOwners = async (spaceOwnerIds: string[]) =>
  Promise.all(
    spaceOwnerIds.map((admin) => getUserRef(admin).get())
  ).then((docs) => docs.map((doc) => withId(doc.data() as User, doc.id)));

export const getSpaceEditors = async (spaceEditorIds: string[]) =>
  Promise.all(
    spaceEditorIds.map((admin) => getUserRef(admin).get())
  ).then((docs) => docs.map((doc) => withId(doc.data() as User, doc.id)));

export const upsertChannel = async (
  channel: Channel,
  spaceId: SpaceId,
  channelIndex?: number
) => {
  return await httpsCallable(
    FIREBASE.functions,
    "venue-upsertChannel"
  )({
    spaceId,
    channelIndex,
    channel,
  }).catch((e) => {
    Bugsnag.notify(e, (event) => {
      event.addMetadata("api/admin::upsertChannel", {
        spaceId,
        channelIndex,
      });
    });
    throw e;
  });
};

export const deleteChannel = async (
  spaceId: SpaceId,
  channelIndex?: number
) => {
  return await httpsCallable(
    FIREBASE.functions,
    "venue-deleteChannel"
  )({
    spaceId,
    channelIndex,
  }).catch((e) => {
    Bugsnag.notify(e, (event) => {
      event.addMetadata("api/admin::deleteChannel", {
        spaceId,
        channelIndex,
      });
    });
    throw e;
  });
};
