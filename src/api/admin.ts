import { UserInfo } from "firebase";
import firebase from "firebase/app";
import _ from "lodash";
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
}

export interface AdvancedVenueInput {
  profileQuestions: Array<Question>;
}

type ImageFileKeys =
  | "bannerImageFile"
  | "logoImageFile"
  | "mapIconImageFile"
  | "mapBackgroundImageFile";
type ImageUrlKeys =
  | "bannerImageUrl"
  | "logoImageUrl"
  | "mapIconImageUrl"
  | "mapBackgroundImageUrl";

interface VenueImageUrls {
  bannerImageUrl?: string;
  logoImageUrl?: string;
  mapIconImageUrl?: string;
  mapBackgroundImageUrl?: string;
}

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
  };

type FirestoreVenueInput = Omit<VenueInput, ImageFileKeys> & VenueImageUrls;

export const createUrlSafeName = (name: string) =>
  name.replace(/\W/g, "").toLowerCase();

const createFirestoreVenueInput = async (input: VenueInput, user: UserInfo) => {
  const storageRef = firebase.storage().ref();

  const urlVenueName = createUrlSafeName(input.name);
  type ImageNaming = {
    fileKey: ImageFileKeys;
    urlKey: ImageUrlKeys;
  };
  const imageKeys: Array<ImageNaming> = [
    { fileKey: "logoImageFile", urlKey: "logoImageUrl" },
    { fileKey: "bannerImageFile", urlKey: "bannerImageUrl" },
    { fileKey: "mapIconImageFile", urlKey: "mapIconImageUrl" },
    { fileKey: "mapBackgroundImageFile", urlKey: "mapBackgroundImageUrl" },
  ];

  let imageInputData = {};

  // upload the files
  for (const entry of imageKeys) {
    const fileArr = input[entry.fileKey];
    if (!fileArr || fileArr.length === 0) continue;
    const file = fileArr[0];
    const uploadFileRef = storageRef.child(
      `users/${user.uid}/venues/${urlVenueName}/${file.name}`
    );
    await uploadFileRef.put(file);
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
