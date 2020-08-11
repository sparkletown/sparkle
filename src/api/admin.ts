import { UserInfo } from "firebase";
import firebase from "firebase/app";
import _ from "lodash";
import { VenueEvent } from "types/VenueEvent";

export interface EventInput {
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  duration_hours: number;
  price: number;
}

interface Question {
  name: string;
  text: string;
}

export interface AdvancedVenueInput {
  profileQuestions: Array<Question>;
}

type ImageFileKeys = "bannerImageFile" | "logoImageFile" | "mapIconImageFile";
type ImageUrlKeys = "bannerImageUrl" | "logoImageUrl" | "mapIconImageUrl";

interface VenueUpdateImageUrls {
  bannerImageUrl?: string;
  logoImageUrl?: string;
  mapIconImageUrl?: string;
}

export interface VenueInput extends AdvancedVenueInput {
  name: string;
  bannerImageFile: FileList;
  logoImageFile: FileList;
  subtitle: string;
  description: string;
  mapIconImageFile?: FileList;
  zoomUrl?: string;
  videoIframeUrl?: string;
  embedIframeUrl?: string;
}

export type VenueInputEdit = Omit<VenueInput, ImageFileKeys> &
  Partial<Pick<VenueInput, ImageFileKeys>> &
  VenueUpdateImageUrls;

type FirestoreVenueInput = Omit<VenueInput, ImageFileKeys> &
  VenueUpdateImageUrls;

export const createUrlSafeName = (name: string) =>
  name.replace(/\W/g, "").toLowerCase();

export const createVenue = async (input: VenueInput, user: UserInfo) => {
  const storageRef = firebase.storage().ref();

  const logoFile = input.logoImageFile[0];
  const bannerFile = input.bannerImageFile[0];
  const mapIconFile = input.mapIconImageFile
    ? input.mapIconImageFile[0]
    : undefined;

  const urlVenueName = createUrlSafeName(input.name);

  // upload logo file
  const uploadLogoRef = storageRef.child(
    `users/${user.uid}/venues/${urlVenueName}/${logoFile.name}`
  );
  await uploadLogoRef.put(logoFile);

  // upload banner file
  const uploadBannerRef = storageRef.child(
    `users/${user.uid}/venues/${urlVenueName}/${bannerFile.name}`
  );
  await uploadBannerRef.put(bannerFile);

  let mapIconDownloadUrl: string | undefined = undefined;

  // upload MapIcon file
  if (mapIconFile) {
    const uploadBannerRef = storageRef.child(
      `users/${user.uid}/venues/${urlVenueName}/${mapIconFile.name}`
    );
    await uploadBannerRef.put(mapIconFile);
    mapIconDownloadUrl = await uploadBannerRef.getDownloadURL();
  }

  const logoDownloadUrl: string = await uploadLogoRef.getDownloadURL();
  const bannerDownloadUrl: string = await uploadBannerRef.getDownloadURL();

  const firestoreVenueInput: FirestoreVenueInput = {
    ..._.omit(input, ["bannerImageFile", "logoImageFile", "mapIconImageFile"]),
    bannerImageUrl: bannerDownloadUrl,
    logoImageUrl: logoDownloadUrl,
    mapIconImageUrl: mapIconDownloadUrl,
  };

  return await firebase.functions().httpsCallable("venue-createVenue")(
    firestoreVenueInput
  );
};

export const updateVenue = async (input: VenueInputEdit, user: UserInfo) => {
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
  };

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
