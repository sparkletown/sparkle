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

exports.removePreviosDanglingSeat = functions.firestore
  .document("/venues/{venueId}/recentSeatedUsers/{userId}")
  .onUpdate(async (change, context) => {
    const { before: beforeSnap, after: afterSnap } = change;
    const before = beforeSnap.data();
    const after = afterSnap.data();

    const { venueId, userId } = context.params;

    const template = before.template;
    if (!template) {
      throw new HttpsError(
        "invalid-argument",
        "Template property is missing from the document"
      );
    }

    const { sectionId: beforeSectionId } = before.venueSpecificData;
    const { sectionId: afterSectionId } = after.venueSpecificData;

    switch (template) {
      case "auditorium":
        if (!beforeSectionId || !afterSectionId)
          throw new HttpsError(
            "invalid-argument",
            `Missing sectionId. Before: ${before}. After: ${after}`
          );
        if (beforeSectionId === afterSectionId) return;

        await admin
          .firestore()
          .collection("venues")
          .doc(venueId)
          .collection("sections")
          .doc(beforeSectionId)
          .collection("seatedSectionUsers")
          .doc(userId)
          .delete();

        break;
      case "jazzbar":
      case "conversationspace":
        //do nothing

        break;
      default:
        throw new HttpsError(
          "invalid-argument",
          `Unsupported template ${template}`
        );
    }
  });
