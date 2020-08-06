import firebase from "firebase/app";
import { UserInfo } from "firebase";
import _ from "lodash";
import { VenueEvent } from "types/VenueEvent";

export interface EventInput {
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  price: number;
}

interface Question {
  name: string;
  text: string;
}

export interface AdvancedVenueInput {
  profileQuestions: Array<Question>;
}

export interface VenueInput extends AdvancedVenueInput {
  name: string;
  bannerImageFile: FileList;
  logoImageFile: FileList;
  tagline: string;
  longDescription: string;
  mapIconImageFile?: FileList;
}

type FirestoreVenueInput = Omit<
  VenueInput,
  "bannerImageFile" | "logoImageFile" | "mapIconImageFile"
> & {
  bannerImageUrl: string;
  logoImageUrl: string;
  mapIconImageUrl?: string;
};

export const createUrlSafeName = (name: string) => name.replace(/\W/g, "");

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
    ..._.omit(input, ["bannerImageFile", "logoImageFile"]),
    bannerImageUrl: bannerDownloadUrl,
    logoImageUrl: logoDownloadUrl,
    mapIconImageUrl: mapIconDownloadUrl,
  };

  return await firebase.functions().httpsCallable("venue-createVenue")(
    firestoreVenueInput
  );
};

export const createEvent = async (
  venueId: string,
  event: Omit<VenueEvent, "id">
) => {
  await firebase.firestore().collection(`venues/${venueId}/events`).add(event);
};

export const updateEvent = async (
  venueId: string,
  eventId: string,
  event: Omit<VenueEvent, "id">
) => {
  await firebase
    .firestore()
    .doc(`venues/${venueId}/events/${eventId}`)
    .update(event);
};
