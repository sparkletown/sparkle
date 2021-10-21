import firebase from "firebase/app";

import { UserLookup } from "types/User";

import { propName } from "utils/propName";

export const getUserLookupRef = (userId: string) =>
  firebase.firestore().collection("userLookup").doc(userId).collection("paths");

export const processBatchForUserLookup = async (
  userId: string | undefined,
  batch: firebase.firestore.WriteBatch,
  refs: firebase.firestore.DocumentReference[],
  isDelete: boolean,
  docPath = "fromUser"
) => {
  if (refs.length !== 1) {
    console.error("Invalid messageRefs.length. Expected 1", refs);
    return;
  }
  const ref = refs[0];

  if (!userId) return;

  if (isDelete) await updateBatchWithDeleteUserLookup(batch, userId, ref);
  else updateBatchWithAddUserLookup(batch, userId, ref, docPath);
};

const updateBatchWithAddUserLookup = (
  batch: firebase.firestore.WriteBatch,
  userId: string,
  ref: firebase.firestore.DocumentReference,
  docPath = ""
) => {
  const userLookupData: UserLookup = {
    firebasePath: ref.path,
    docPath,
  };
  batch.set(getUserLookupRef(userId).doc(), userLookupData);
};

const updateBatchWithDeleteUserLookup = async (
  batch: firebase.firestore.WriteBatch,
  userId: string,
  ref: firebase.firestore.DocumentReference
) => {
  const lookups = await getUserLookupRef(userId)
    .where(propName<UserLookup>("firebasePath"), "==", ref.path)
    .get();
  lookups.forEach(({ ref }) => batch.delete(ref));
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

export const removeWithUserLookup = async (
  userId: string,
  ref: firebase.firestore.DocumentReference
) => {
  const batch = firebase.firestore().batch();
  batch.delete(ref);
  await updateBatchWithDeleteUserLookup(batch, userId, ref);
  return batch.commit();
};
