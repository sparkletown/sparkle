const admin = require("firebase-admin");

const functions = require("firebase-functions");

exports.incrementSectionsCount = functions.firestore
  .document("venues/{venueId}/sections/{sectionId}")
  .onCreate(async (change, context) => {
    const venueRef = await admin
      .firestore()
      .collection("venues")
      .doc(context.params.venueId);

    return venueRef.update({
      sectionsCount: admin.firestore.FieldValue.increment(1),
    });
  });

exports.decrementSectionsCount = functions.firestore
  .document("venues/{venueId}/sections/{sectionId}")
  .onDelete(async (change, context) => {
    const venueRef = await admin
      .firestore()
      .collection("venues")
      .doc(context.params.venueId);

    return venueRef.update({
      sectionsCount: admin.firestore.FieldValue.increment(-1),
    });
  });
