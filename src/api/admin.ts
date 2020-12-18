import firebase, { UserInfo } from "firebase/app";
import { omit } from "lodash";
import { VenueEvent } from "types/VenueEvent";
import { VenuePlacement } from "types/Venue";
import { CampRoomData } from "types/CampRoomData";

export interface EventInput {
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  duration_hours: number;
  price: number;
  host: string;
  room?: string;
}

interface Question {
  name: string;
  text: string;
  link?: string;
}

export interface AdvancedVenueInput {
  profile_questions: Array<Question>;
  code_of_conduct_questions: Array<Question>;
}

type VenueImageFileKeys =
  | "bannerImageFile"
  | "logoImageFile"
  | "mapIconImageFile"
  | "mapBackgroundImageFile";
type VenueImageUrlKeys =
  | "bannerImageUrl"
  | "logoImageUrl"
  | "mapIconImageUrl"
  | "mapBackgroundImageUrl";

type RoomImageFileKeys = "image_file";
type RoomImageUrlKeys = "image_url";

type VenueImageUrls = Partial<Record<VenueImageUrlKeys, string>>;
type RoomImageUrls = Partial<Record<RoomImageUrlKeys, string>>;

export type RoomInput = Omit<CampRoomData, "image_url"> & {
  image_url?: string;
  image_file?: FileList;
};

export type VenueInput = AdvancedVenueInput &
  VenueImageUrls & {
    name: string;
    bannerImageFile?: FileList;
    logoImageFile?: FileList;
    mapIconImageFile?: FileList;
    mapBackgroundImageFile?: FileList;
    subtitle: string;
    description: string;
    zoomUrl?: string;
    iframeUrl?: string;
    template: string;
    rooms?: Array<CampRoomData>;
    placement?: Omit<VenuePlacement, "state">;
    placementRequests?: string;
    adultContent: boolean;
    showGrid?: boolean;
    columns?: number;
    width?: number;
    height?: number;
    bannerMessage?: string;
    parentId?: string;
    owners?: string[];
    showRangers?: boolean;
    chatTitle?: string;
    attendeesTitle?: string;
    auditoriumRows?: number;
    auditoriumColumns?: number;
    showReactions?: boolean;
    showRadio?: boolean;
    radioStations?: string;
    showZendesk?: boolean;
  };

type FirestoreVenueInput = Omit<VenueInput, VenueImageFileKeys> &
  VenueImageUrls;

type FirestoreRoomInput = Omit<RoomInput, RoomImageFileKeys> & RoomImageUrls;

export type PlacementInput = {
  mapIconImageFile?: FileList;
  mapIconImageUrl?: string;
  addressText?: string;
  notes?: string;
  placement?: Omit<VenuePlacement, "state">;
  width: number;
  height: number;
};

export const createUrlSafeName = (name: string) =>
  name.replace(/\W/g, "").toLowerCase();

const getVenueOwners = async (venueId: string): Promise<string[]> => {
  const owners = (
    await firebase.firestore().collection("venues").doc(venueId).get()
  ).data()?.owners;

  return owners;
};

const createFirestoreVenueInput = async (input: VenueInput, user: UserInfo) => {
  const storageRef = firebase.storage().ref();

  const urlVenueName = createUrlSafeName(input.name);
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
      fileKey: "mapIconImageFile",
      urlKey: "mapIconImageUrl",
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
      `users/${user.uid}/venues/${urlVenueName}/${randomPrefix}-${file.name}`
    );

    await uploadFileRef.put(file);
    const downloadUrl: string = await uploadFileRef.getDownloadURL();
    imageInputData = { ...imageInputData, [entry.urlKey]: downloadUrl };
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
  };

  // Default to showing Zendesk
  if (input.showZendesk === undefined) {
    input.showZendesk = true;
  }

  return firestoreVenueInput;
};

const createFirestoreRoomInput = async (
  input: RoomInput,
  venueId: string,
  user: UserInfo
) => {
  const storageRef = firebase.storage().ref();

  const urlRoomName = createUrlSafeName(
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

export const createVenue = async (input: VenueInput, user: UserInfo) => {
  const firestoreVenueInput = await createFirestoreVenueInput(input, user);
  return await firebase.functions().httpsCallable("venue-createVenue")(
    firestoreVenueInput
  );
};

export const updateVenue = async (input: VenueInput, user: UserInfo) => {
  const firestoreVenueInput = await createFirestoreVenueInput(input, user);

  return await firebase.functions().httpsCallable("venue-updateVenue")(
    firestoreVenueInput
  );
};

export const upsertRoom = async (
  input: RoomInput,
  venueId: string,
  user: UserInfo,
  roomIndex?: number
) => {
  const firestoreVenueInput = await createFirestoreRoomInput(
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
  firebase.functions().httpsCallable("venue-addVenueOwner")({
    venueId,
    newOwnerId,
  });

export const removeVenueOwner = async (venueId: string, ownerId: string) =>
  firebase.functions().httpsCallable("venue-removeVenueOwner")({
    venueId,
    ownerId,
  });
