import firebase from "firebase/compat/app";

import { ProfileLink, UserLocation } from "types/User";

import { RegisterData } from "pages/auth/RegisterForm/RegisterForm";

import { CodeOfConductFormData } from "./CodeOfConduct";
import { ProfileFormData } from "./Profile";

type AnonModeUpdateData = {
  anonMode: boolean;
};

type MirrorVideoUpdateData = {
  mirrorVideo: boolean;
};

export const updateUserProfile = (
  userId: string,
  profileData:
    | { profileLinks: ProfileLink[] }
    | CodeOfConductFormData
    | ProfileFormData
    | AnonModeUpdateData
    | MirrorVideoUpdateData
    | (ProfileFormData | UserLocation)
) => {
  const firestore = firebase.firestore();
  const doc = `users/${userId}`;

  return firestore
    .doc(doc)
    .update(profileData)
    .catch(() => {
      firestore.doc(doc).set(profileData);
    });
};

export const updateUserPrivate = (
  userId: string,
  privateData: RegisterData
) => {
  const firestore = firebase.firestore();
  const doc = `userprivate/${userId}`;
  return firestore
    .doc(doc)
    .update(privateData)
    .catch(() => {
      firestore.doc(doc).set(privateData);
    });
};
