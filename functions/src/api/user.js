const admin = require("firebase-admin");

const getUserLookupRef = (userId) =>
  admin.firestore().collection("usersLookup").doc(userId).collection("paths");

exports.removeWithUserLookup = (userId, docRef) => {
  const batch = admin.firestore().batch();
  batch.delete(docRef);
  batch.delete(getUserLookupRef(userId).doc(docRef.path));
  return batch.commit();
};
