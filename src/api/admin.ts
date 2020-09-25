import firebase, { UserInfo } from "firebase/app";
import _ from "lodash";
import { VenueEvent } from "types/VenueEvent";
import { VenuePlacement } from "types/Venue";
import { CampRoomData } from "types/CampRoomData";
import jimp from "jimp";
import {
  LOGO_IMAGE_WIDTH_PX,
  BANNER_IMAGE_WIDTH_PX,
  MAP_ICON_WIDTH_PX,
  ROOM_IMAGE_WIDTH_PX,
} from "settings";

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
}

export interface AdvancedVenueInput {
  profileQuestions: Array<Question>;
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
    videoIframeUrl?: string;
    embedIframeUrl?: string;
    template: any;
    rooms?: Array<any>;
    placement?: Omit<VenuePlacement, "state">;
    placementRequests?: string;
    adultContent: boolean;
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
};

export const createUrlSafeName = (name: string) =>
  name.replace(/\W/g, "").toLowerCase();

const compressImage = async (file: File, compressionWidth?: number) => {
  // cannot resize gifs
  if (file.type === "image/gif" || compressionWidth === undefined) return file;

  const jimpImage = await jimp.read(URL.createObjectURL(file));

  // only resize if intrinsic width greater than compression width
  if (jimpImage.bitmap.width <= compressionWidth) return file;

  jimpImage.resize(compressionWidth, jimp.AUTO);
  const buffer = await jimpImage.getBufferAsync(jimpImage.getMIME());
  return buffer;
};

type ImageConfig = {
  compressionWidth?: number;
};

const createFirestoreVenueInput = async (input: VenueInput, user: UserInfo) => {
  const storageRef = firebase.storage().ref();

  const urlVenueName = createUrlSafeName(input.name);
  type ImageNaming = ImageConfig & {
    fileKey: VenueImageFileKeys;
    urlKey: VenueImageUrlKeys;
  };
  const imageKeys: Array<ImageNaming> = [
    {
      fileKey: "logoImageFile",
      urlKey: "logoImageUrl",
      compressionWidth: LOGO_IMAGE_WIDTH_PX,
    },
    {
      fileKey: "bannerImageFile",
      urlKey: "bannerImageUrl",
      compressionWidth: BANNER_IMAGE_WIDTH_PX,
    },
    {
      fileKey: "mapIconImageFile",
      urlKey: "mapIconImageUrl",
      compressionWidth: MAP_ICON_WIDTH_PX,
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

    const buffer = await compressImage(file, entry.compressionWidth);

    await uploadFileRef.put(buffer);
    const downloadUrl: string = await uploadFileRef.getDownloadURL();
    imageInputData = { ...imageInputData, [entry.urlKey]: downloadUrl };
  }

  const firestoreVenueInput: FirestoreVenueInput = {
    ..._.omit(
      input,
      imageKeys.map((entry) => entry.fileKey)
    ),
    ...imageInputData,
    rooms: [], // eventually we will be getting the rooms from the form
  };
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
  type ImageNaming = ImageConfig & {
    fileKey: RoomImageFileKeys;
    urlKey: RoomImageUrlKeys;
  };
  const imageKeys: Array<ImageNaming> = [
    {
      fileKey: "image_file",
      urlKey: "image_url",
      compressionWidth: ROOM_IMAGE_WIDTH_PX,
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

    const buffer = await compressImage(file, entry.compressionWidth);

    await uploadFileRef.put(buffer);
    const downloadUrl: string = await uploadFileRef.getDownloadURL();
    imageInputData = { ...imageInputData, [entry.urlKey]: downloadUrl };
  }

  const firestoreRoomInput: FirestoreRoomInput = {
    ..._.omit(
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
