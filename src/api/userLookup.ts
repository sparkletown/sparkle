import firebase from "firebase/app";

export const getUserLookupRef = (
  userId: string,
  ref: firebase.firestore.DocumentReference
) => firebase.firestore().doc(`userLookup/${userId}/${ref.path}`);

export type UserLookupLocation =
  | "venueChat"
  | "venueChatThread"
  | "privateChat"
  | "privateChatThread"
  | "jukeboxChat"
  | "auditoriumSection";

export const updateBatchWithAddUserLookup = (
  batch: firebase.firestore.WriteBatch,
  userId: string,
  ref: firebase.firestore.DocumentReference,
  docPath = ""
) => {
  batch.set(getUserLookupRef(userId, ref), { path: docPath });
};

export const updateBatchWithDeleteUserLookup = (
  batch: firebase.firestore.WriteBatch,
  userId: string,
  ref: firebase.firestore.DocumentReference
) => {
  batch.delete(getUserLookupRef(userId, ref));
};

export const addWithUserLookup = <T>(
  data: T,
  userId: string,
  ref: firebase.firestore.DocumentReference,
  docPath = ""
) => {
  const batch = firebase.firestore().batch();
  batch.set(ref, data);
  updateBatchWithAddUserLookup(batch, userId, ref, docPath);
  return batch.commit();
};

export const removeWithUserLookup = (
  userId: string,
  ref: firebase.firestore.DocumentReference
) => {
  const batch = firebase.firestore().batch();
  batch.delete(ref);
  updateBatchWithDeleteUserLookup(batch, userId, ref);
  return batch.commit();
};
