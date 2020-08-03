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

export interface VenueInput {
  name: string;
  bannerImageFile: FileList;
  logoImageFile: FileList;
  tagline: string;
  longDescription: string;
}

type FirestoreVenueInput = Omit<
  VenueInput,
  "bannerImageFile" | "logoImageFile"
> & {
  bannerImageUrl: string;
  logoImageUrl: string;
};

export const createUrlSafeName = (name: string) => name.replace(/\W/g, "");

export const createVenue = async (input: VenueInput, user: UserInfo) => {
  const storageRef = firebase.storage().ref();

  const logoFile = input.logoImageFile[0];
  const bannerFile = input.logoImageFile[0];

  const urlVenueName = createUrlSafeName(input.name);

  // upload logo file
  const uploadLogoRef = storageRef.child(
    `users/${user.uid}/venues/${urlVenueName}/${logoFile.name}`
  );
  await uploadLogoRef.put(input.logoImageFile[0]);

  // upload banner file
  const uploadBannerRef = storageRef.child(
    `users/${user.uid}/venues/${urlVenueName}/${bannerFile.name}`
  );
  await uploadBannerRef.put(input.logoImageFile[0]);

  const logoDownloadUrl: string = await uploadLogoRef.getDownloadURL();
  const bannerDownloadUrl: string = await uploadLogoRef.getDownloadURL();

  const firestoreVenueInput: FirestoreVenueInput = {
    ..._.omit(input, ["bannerImageFile", "logoImageFile"]),
    bannerImageUrl: bannerDownloadUrl,
    logoImageUrl: logoDownloadUrl,
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
