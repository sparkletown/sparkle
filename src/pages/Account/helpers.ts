import firebase from "firebase/compat/app";

import { ProfileLink, UserLocation } from "types/User";

import { ProfileSchemaShape } from "forms/profileSchema";

type MirrorVideoUpdateData = {
  mirrorVideo: boolean;
};

export const updateUserProfile = (
  userId: string,
  profileData:
    | { profileLinks: ProfileLink[] }
    | ProfileSchemaShape
    | MirrorVideoUpdateData
    | (ProfileSchemaShape | UserLocation)
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
