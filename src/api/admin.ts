import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";
import { omit } from "lodash";

import {
  ACCEPTED_IMAGE_TYPES,
  DEFAULT_SECTIONS_AMOUNT,
  DEFAULT_SHOW_REACTIONS,
  DEFAULT_SHOW_SHOUTOUTS,
  INVALID_SLUG_CHARS_REGEX,
} from "settings";

import { EntranceStepConfig } from "types/EntranceStep";
import { Room } from "types/rooms";
import { UsernameVisibility, UserStatus } from "types/User";
import {
  RoomVisibility,
  Venue_v2_EntranceConfig,
  VenueAdvancedConfig,
  VenueEvent,
  VenuePlacement,
  VenueTemplate,
} from "types/venues";

import { WithId, WithWorldId } from "utils/id";
import { venueInsideUrl } from "utils/url";

export interface EventInput {
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  duration_hours: number;
  duration_minutes?: number;
  host: string;
  room?: string;
}

interface Question {
  name: string;
  text: string;
  link?: string;
}

type VenueImageFileKeys =
  | "bannerImageFile"
  | "logoImageFile"
  | "mapBackgroundImageFile";

type VenueImageUrlKeys =
  | "bannerImageUrl"
  | "logoImageUrl"
  | "mapBackgroundImageUrl";

type ImageFileKeys =
  | "bannerImageFile"
  | "logoImageFile"
  | "mapBackgroundImageFile";

type ImageUrlKeys = "bannerImageUrl" | "logoImageUrl" | "mapBackgroundImageUrl";

type RoomImageFileKeys = "image_file";
type RoomImageUrlKeys = "image_url";

type VenueImageUrls = Partial<Record<VenueImageUrlKeys, string>>;
type RoomImageUrls = Partial<Record<RoomImageUrlKeys, string>>;

export type RoomInput = Omit<Room, "image_url"> & {
  image_url?: string;
  image_file?: FileList;
};

export type RoomInput_v2 = Room & {
  venueName?: string;
  useUrl?: boolean;
  image_url?: string;
  image_file?: FileList;
};

export type VenueInput = VenueImageUrls & {
  name: string;
  bannerImageFile?: FileList;
  logoImageFile?: FileList;
  mapBackgroundImageFile?: FileList;
  subtitle?: string;
  description?: string;
  zoomUrl?: string;
  iframeUrl?: string;
  autoPlay?: boolean;
  template: VenueTemplate;
  rooms?: Array<Room>;
  placement?: Omit<VenuePlacement, "state">;
  placementRequests?: string;
  adultContent: boolean;
  showGrid?: boolean;
  columns?: number;
  width?: number;
  height?: number;
  parentId?: string;
  owners?: string[];
  auditoriumRows?: number;
  auditoriumColumns?: number;
  userStatuses?: UserStatus[];
  showReactions?: boolean;
  enableJukebox?: boolean;
  showShoutouts?: boolean;
  showRadio?: boolean;
  radioStations?: string;
  showUserStatus?: boolean;
  hasSocialLoginEnabled?: boolean;
  roomVisibility?: RoomVisibility;
};

export interface VenueInput_v2
  extends VenueAdvancedConfig,
    Venue_v2_EntranceConfig {
  name: string;
  description?: string;
  subtitle?: string;
  bannerImageFile?: FileList;
  bannerImageUrl?: string;
  logoImageFile?: FileList;
  logoImageUrl?: string;
  rooms?: Room[];
  mapBackgroundImageFile?: FileList;
  mapBackgroundImageUrl?: string;
  template?: VenueTemplate;
  iframeUrl?: string;
  autoPlay?: boolean;
  parentId?: string;
  start_utc_seconds?: number;
  end_utc_seconds?: number;
  showShoutouts?: boolean;
  showReactions?: boolean;
}

// NOTE: world might have many fields, please keep them in alphabetic order
// @debt move to src/types/world
export interface World {
  adultContent?: boolean;
  attendeesTitle?: string;
  chatTitle?: string;
  config: {
    landingPageConfig: {
      coverImageUrl: string;
      description?: string;
      subtitle?: string;
    };
  };
  createdAt: Date;
  entrance?: EntranceStepConfig[];
  host: {
    icon: string;
  };
  name: string;
  owners: string[];
  questions?: {
    code?: Question[];
    profile?: Question[];
  };
  radioStations?: string[];
  requiresDateOfBirth?: boolean;
  showBadges?: boolean;
  showNametags?: UsernameVisibility;
  showRadio?: boolean;
  showSchedule?: boolean;
  showUserStatus?: boolean;
  slug: string;
  updatedAt: Date;
  userStatuses?: UserStatus[];
}

type FirestoreVenueInput = Omit<VenueInput, VenueImageFileKeys> &
  VenueImageUrls;

type FirestoreVenueInput_v2 = Omit<VenueInput_v2, ImageFileKeys> &
  Partial<Record<ImageUrlKeys, string>> & {
    template: VenueTemplate;
    parentId?: string;
  };

type FirestoreRoomInput = Omit<RoomInput, RoomImageFileKeys> & RoomImageUrls;

type FirestoreRoomInput_v2 = Omit<RoomInput_v2, RoomImageFileKeys> &
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

export const createSlug = (name: string) =>
  name.replace(INVALID_SLUG_CHARS_REGEX, "").toLowerCase();

export const getVenueOwners = async (venueId: string): Promise<string[]> => {
  const owners = (
    await firebase.firestore().collection("venues").doc(venueId).get()
  ).data()?.owners;

  return owners;
};

const createFirestoreVenueInput = async (
  input: VenueInput,
  user: firebase.UserInfo
) => {
  const storageRef = firebase.storage().ref();

  const slug = createSlug(input.name);
  type ImageNaming = {
    fileKey: VenueImageFileKeys;
    urlKey: VenueImageUrlKeys;
  };
  const imageKeys: Array<ImageNaming> = [
    {
      fileKey: "logoImageFile",
      urlKey: "logoImageUrl",
    },
    {
      fileKey: "bannerImageFile",
      urlKey: "bannerImageUrl",
    },
    {
      fileKey: "mapBackgroundImageFile",
      urlKey: "mapBackgroundImageUrl",
    },
  ];

  let imageInputData = {};

  // upload the files
  for (const entry of imageKeys) {
    const fileArr = input[entry.fileKey];
    if (!fileArr || fileArr.length === 0) continue;
    const file = fileArr[0];

    // add a random prefix to the file name to avoid overwriting a file, which invalidates the previous downloadURLs
    const randomPrefix = Math.random().toString();

    const uploadFileRef = storageRef.child(
      `users/${user.uid}/venues/${slug}/${randomPrefix}-${file.name}`
    );

    await uploadFileRef.put(file);
    const downloadUrl: string = await uploadFileRef.getDownloadURL();

    imageInputData = {
      ...imageInputData,
      [entry.urlKey]: downloadUrl,
    };
  }

  let owners: string[] = [];
  if (input.parentId) {
    owners = await getVenueOwners(input.parentId);
  }

  const firestoreVenueInput: FirestoreVenueInput = {
    ...omit(
      input,
      imageKeys.map((entry) => entry.fileKey)
    ),
    owners,
    ...imageInputData,
    rooms: [], // eventually we will be getting the rooms from the form
    // While name is used as URL slug and there is possibility cloud functions might miss this step, canonicalize before saving
    name: slug,
  };

  return firestoreVenueInput;
};

const createFirestoreVenueInput_v2 = async (
  input: VenueInput_v2,
  user: firebase.UserInfo
) => {
  const storageRef = firebase.storage().ref();
  const slug = createSlug(input.name);
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
      fileKey: "bannerImageFile",
      urlKey: "bannerImageUrl",
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

    const uploadFileRef = storageRef.child(
      `users/${user.uid}/venues/${slug}/${urlKey}.${fileExtension}`
    );

    await uploadFileRef.put(file);
    const downloadUrl: string = await uploadFileRef.getDownloadURL();

    imageInputData = {
      ...imageInputData,
      [urlKey]: downloadUrl,
    };
  }

  const firestoreVenueInput: FirestoreVenueInput_v2 = {
    ...omit(
      input,
      imageKeys.map((entry) => entry.fileKey)
    ),
    ...imageInputData,
    template: input.template ?? VenueTemplate.partymap,
    parentId: input.parentId ?? "",
    // While name is used as URL slug and there is possibility cloud functions might miss this step, canonicalize before saving
    name: slug,
  };
  return firestoreVenueInput;
};

export const createVenue = async (
  input: VenueInput,
  user: firebase.UserInfo
) => {
  const firestoreVenueInput = await createFirestoreVenueInput(input, user);
  return await firebase.functions().httpsCallable("venue-createVenue")(
    firestoreVenueInput
  );
};

export const createVenue_v2 = async (
  input: WithWorldId<VenueInput_v2>,
  user: firebase.UserInfo
) => {
  const firestoreVenueInput = await createFirestoreVenueInput_v2(
    {
      ...input,
      showShoutouts: input.showShoutouts ?? DEFAULT_SHOW_SHOUTOUTS,
      showReactions: input.showReactions ?? DEFAULT_SHOW_REACTIONS,
      rooms: [],
    },
    user
  );

  const venueResponse = await firebase
    .functions()
    .httpsCallable("venue-createVenue_v2")({
    ...firestoreVenueInput,
    worldId: input.worldId,
  });

  if (input.template === VenueTemplate.auditorium) {
    await firebase.functions().httpsCallable("venue-setAuditoriumSections")({
      venueId: firestoreVenueInput.name,
      numberOfSections: DEFAULT_SECTIONS_AMOUNT,
    });
  }

  return venueResponse;
};

// @debt TODO: Use this when the UI is adapted to support and show worlds instead of venues.
export const updateVenue = async (
  input: WithId<VenueInput>,
  user: firebase.UserInfo
) => {
  const firestoreVenueInput = await createFirestoreVenueInput(input, user);

  return await firebase.functions().httpsCallable("venue-updateVenue")(
    firestoreVenueInput
  );
};

export const updateVenue_v2 = async (
  input: WithWorldId<VenueInput_v2>,
  user: firebase.UserInfo
) => {
  const firestoreVenueInput = await createFirestoreVenueInput_v2(input, user);
  return firebase
    .functions()
    .httpsCallable("venue-updateVenue_v2")(firestoreVenueInput)
    .catch((error) => {
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
  user: firebase.UserInfo
) => {
  const firestoreVenueInput = await createFirestoreVenueInput_v2(input, user);

  return firebase
    .functions()
    .httpsCallable("venue-updateMapBackground")(firestoreVenueInput)
    .catch((error) => {
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
  const storageRef = firebase.storage().ref();

  const urlRoomName = createSlug(
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

  // upload the files
  for (const entry of imageKeys) {
    const fileArr = input[entry.fileKey];
    if (!fileArr || fileArr.length === 0) continue;
    const file = fileArr[0];
    const uploadFileRef = storageRef.child(
      `users/${user.uid}/venues/${venueId}/${urlRoomName}/${file.name}`
    );

    await uploadFileRef.put(file);
    const downloadUrl: string = await uploadFileRef.getDownloadURL();
    imageInputData = { ...imageInputData, [entry.urlKey]: downloadUrl };
  }

  const firestoreRoomInput: FirestoreRoomInput = {
    ...omit(
      input,
      imageKeys.map((entry) => entry.fileKey)
    ),
    ...imageInputData,
  };
  return firestoreRoomInput;
};

const createFirestoreRoomInput_v2 = async (
  input: RoomInput_v2,
  venueId: string,
  user: firebase.UserInfo
) => {
  const storageRef = firebase.storage().ref();

  const urlRoomName = createSlug(
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

  // upload the files
  for (const entry of imageKeys) {
    const fileArr = input[entry.fileKey];
    if (!fileArr || fileArr.length === 0) continue;
    const file = fileArr[0];
    const uploadFileRef = storageRef.child(
      `users/${user.uid}/venues/${venueId}/${urlRoomName}/${file.name}`
    );

    await uploadFileRef.put(file);
    const downloadUrl: string = await uploadFileRef.getDownloadURL();
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
        : window.origin + venueInsideUrl(input.venueName),
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

  return await firebase
    .functions()
    .httpsCallable("venue-upsertRoom")({
      venueId,
      roomIndex,
      room: firestoreVenueInput,
    })
    .catch((e) => {
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
  return await firebase
    .functions()
    .httpsCallable("venue-deleteRoom")({
      venueId,
      room,
    })
    .catch((e) => {
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
  input: RoomInput_v2,
  venueId: string,
  user: firebase.UserInfo,
  roomIndex: number
) => {
  const firestoreVenueInput = await createFirestoreRoomInput_v2(
    input,
    venueId,
    user
  );

  return await firebase.functions().httpsCallable("venue-upsertRoom")({
    venueId,
    roomIndex,
    room: firestoreVenueInput,
  });
};

export const bulkUpdateRooms = async (
  venueId: string,
  user: firebase.UserInfo,
  rooms: RoomInput_v2[]
) => {
  const test = rooms.map((firestoreVenueInput, index) => {
    return firebase.functions().httpsCallable("venue-upsertRoom")({
      venueId,
      index,
      room: firestoreVenueInput,
    });
  });

  return Promise.all(test);
};

export const createRoom = async (
  input: RoomInput_v2,
  venueId: string,
  user: firebase.UserInfo
) => {
  const firestoreVenueInput = await createFirestoreRoomInput_v2(
    input,
    venueId,
    user
  );

  return await firebase.functions().httpsCallable("venue-upsertRoom")({
    venueId,
    room: {
      ...firestoreVenueInput,
      // Initial positions and size
      // TODO: As an alternative to the center positioning, maybe have a Math.random() to place rooms at random
      x_percent: 50,
      y_percent: 50,
      width_percent: 5,
      height_percent: 5,
    },
  });
};

export const createEvent = async (venueId: string, event: VenueEvent) => {
  await firebase.firestore().collection(`venues/${venueId}/events`).add(event);
};

export const updateEvent = async (
  venueId: string,
  eventId: string,
  event: VenueEvent
) => {
  await firebase
    .firestore()
    .doc(`venues/${venueId}/events/${eventId}`)
    .update(event);
};

export const deleteEvent = async (venueId: string, eventId: string) => {
  await firebase
    .firestore()
    .collection(`venues/${venueId}/events`)
    .doc(eventId)
    .delete();
};

export const addVenueOwner = async (venueId: string, newOwnerId: string) =>
  await firebase.functions().httpsCallable("venue-addVenueOwner")({
    venueId,
    newOwnerId,
  });

export const removeVenueOwner = async (venueId: string, ownerId: string) =>
  firebase.functions().httpsCallable("venue-removeVenueOwner")({
    venueId,
    ownerId,
  });
