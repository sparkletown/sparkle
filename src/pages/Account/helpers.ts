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

export const updateUserProfile = async (
  userId: string,
  data:
    | CodeOfConductFormData
    | ProfileFormData
    | QuestionsFormData
    | ((ProfileFormData & QuestionsFormData) | LocationUpdateData)
    | RegisterData
) => {
  const firestore = firebase.firestore();
  const doc = `users/${userId}`;
  try {
    return firestore.doc(doc).update(data);
  } catch (e) {
    firestore.doc(doc).set(data);
  }
};

export const updateUserPrivate = async (userId: string, data: RegisterData) => {
  const firestore = firebase.firestore();
  const doc = `userprivate/${userId}`;
  try {
    return firestore.doc(doc).update(data);
  } catch (e) {
    firestore.doc(doc).set(data);
  }
};
