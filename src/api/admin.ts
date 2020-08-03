import firebase from "firebase/app";
import { UserInfo } from "firebase";
import _ from "lodash";

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
  console.log("createVenue -> user", user);

  // upload logo file
  const uploadLogoRef = storageRef.child(
    `users/${user.uid}/venues/${createUrlSafeName(urlVenueName)}/${
      logoFile.name
    }`
  );
  await uploadLogoRef.put(input.logoImageFile[0]);

  // upload banner file
  const uploadBannerRef = storageRef.child(
    `users/${user.uid}/venues/${createUrlSafeName(urlVenueName)}/${
      bannerFile.name
    }`
  );
  await uploadBannerRef.put(input.logoImageFile[0]);

  const logoDownloadUrl: string = await uploadLogoRef.getDownloadURL();
  const bannerDownloadUrl: string = await uploadLogoRef.getDownloadURL();

  const FirestoreVenueInput = {
    ..._.omit(input, ["bannerImageFile", "logoImageFile"]),
    bannerImageUrl: bannerDownloadUrl,
    logoImageUrl: logoDownloadUrl,
  };
  console.log("FirestoreVenueInput", FirestoreVenueInput);

  return await firebase.functions().httpsCallable("venue-createVenue")(
    FirestoreVenueInput
  );
};
