import firebase from "firebase/app";

import { CodeOfConductFormData } from "./CodeOfConduct";
import { ProfileFormData } from "./Profile";
import { QuestionsFormData } from "./Questions";
import { RegisterData } from "components/organisms/AuthenticationModal/RegisterForm/RegisterForm";

type LocationUpdateData = {
  lastSeenAt: number;
  lastSeenIn: string | null;
  room: string | null; // legacy
};

type KidsModeUpdateData = {
  kidsMode: boolean;
};

export const updateUserProfile = (
  userId: string,
  profileData:
    | CodeOfConductFormData
    | ProfileFormData
    | QuestionsFormData
    | KidsModeUpdateData
    | ((ProfileFormData & QuestionsFormData) | LocationUpdateData)
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
