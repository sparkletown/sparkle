import firebase from "firebase/app";

export const getUserLookupTableRef = () =>
  firebase.firestore().collection("usersLookup");

export const getUserLookupRef = (userId: string) =>
  getUserLookupTableRef().doc(userId).collection("paths");

export const updateBatchWithUserLookup = (
  batch: firebase.firestore.WriteBatch,
  userId: string,
  ref: firebase.firestore.DocumentReference,
  docPath: string = ""
) => {
  batch.set(getUserLookupRef(userId).doc(ref.path), { path: docPath });
};

export const batchUserLookup = <T>(
  data: T,
  userId: string,
  ref: firebase.firestore.DocumentReference
) => {
  const batch = firebase.firestore().batch();
  batch.set(ref, data);
  batch.set(getUserLookupRef(userId).doc(ref.path), {});
  return batch.commit();
};

export const removeWithUserLookup = (
  userId: string,
  ref: firebase.firestore.DocumentReference
) => {
  const batch = firebase.firestore().batch();
  batch.delete(ref);
  batch.delete(getUserLookupRef(userId).doc(ref.path));
  return batch.commit();
};
