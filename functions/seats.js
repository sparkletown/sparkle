const admin = require("firebase-admin");

const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");

exports.removePreviosDanglingSeat = functions.firestore
  .document("/venues/{venueId}/recentSeatedUsers/{userId}")
  .onUpdate(async (change, context) => {
    const { before: beforeSnap, after: afterSnap } = change;
    const before = beforeSnap.val();
    const after = afterSnap.val();

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
          .doc(sectionId)
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
