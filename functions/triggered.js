const admin = require("firebase-admin");

const functions = require("firebase-functions");

exports.incrementSectionsCount = functions.firestore
  .document("venues/{venueId}/sections/{sectionId}")
  .onCreate((change, context) => {
    const venueRef = admin
      .firestore()
      .collection("venues")
      .doc(context.params.venueId);

    venueRef.update({
      sectionsCount: admin.firestore.FieldValue.increment(1),
    });
  });

exports.decrementSectionsCount = functions.firestore
  .document("venues/{venueId}/sections/{sectionId}")
  .onDelete((change, context) => {
    const venueRef = admin
      .firestore()
      .collection("venues")
      .doc(context.params.venueId);

    venueRef.update({
      sectionsCount: admin.firestore.FieldValue.increment(-1),
    });
  });
