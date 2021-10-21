import firebase from "firebase/app";

export const getUserLookupTableRef = () =>
  firebase.firestore().collection("usersLookup");

export const getUserLookupRef = (userId: string) =>
  getUserLookupTableRef().doc(userId).collection("paths");

export const updateBatchWithAddUserLookup = (
  batch: firebase.firestore.WriteBatch,
  userId: string,
  ref: firebase.firestore.DocumentReference,
  docPath = ""
) => {
  batch.set(getUserLookupRef(userId).doc(ref.path), { path: docPath });
};

export const updateBatchWithDeleteUserLookup = (
  batch: firebase.firestore.WriteBatch,
  userId: string,
  ref: firebase.firestore.DocumentReference
) => {
  batch.delete(getUserLookupRef(userId).doc(ref.path));
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
