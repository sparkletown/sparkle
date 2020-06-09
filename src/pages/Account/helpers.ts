import firebase from "firebase/app";

import { CodeOfConductFormData } from "./CodeOfConduct";
import { ProfileFormData } from "./Profile";
import { QuestionsFormData } from "./Questions";

const updateUserProfile = (
  userId: string,
  profileData:
    | CodeOfConductFormData
    | ProfileFormData
    | QuestionsFormData
    | (ProfileFormData & QuestionsFormData)
) => {
  const firestore = firebase.firestore();
  const doc = `users/${userId}`;
  return firestore
    .doc(doc)
    .update(profileData)
    .catch((e) => {
      firestore.doc(doc).set(profileData);
    });
};

export { updateUserProfile };
