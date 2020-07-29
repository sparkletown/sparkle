import firebase from "firebase/app";

import { CodeOfConductFormData } from "./CodeOfConduct";
import { ProfileFormData } from "./Profile";
import { QuestionsFormData } from "./Questions";

type LocationUpdateData = {
  lastSeenAt: number;
  lastSeenIn: string | null;
  room: string | null; // legacy
};

const updateUserProfile = (
  userId: string,
  profileData:
    | CodeOfConductFormData
    | ProfileFormData
    | QuestionsFormData
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

export { updateUserProfile };
