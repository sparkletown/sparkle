import firebase from "firebase/app";

export const getUserLookupTableRef = () =>
  firebase.firestore().collection("usersLookup");

export const getUserLookupRef = (userId: string) =>
  getUserLookupTableRef().doc(userId).collection("paths");

export const addUserLookup = (
  batch: firebase.firestore.WriteBatch,
  userId: string,
  ref: firebase.firestore.DocumentReference
) => {
  batch.set(getUserLookupRef(userId).doc(ref.path), {});
};

export const removeUserLookup = (
  batch: firebase.firestore.WriteBatch,
  userId: string,
  ref: firebase.firestore.DocumentReference
) => {
  batch.delete(getUserLookupRef(userId).doc(ref.path));
};
