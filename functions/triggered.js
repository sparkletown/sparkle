const admin = require("firebase-admin");

const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");
const { removeWithUserLookup } = require("./src/api/user");

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

const removePreviousDanglingSeat = async (
  beforeSnap,
  afterSnap,
  venueId,
  userId
) => {
  const before = beforeSnap.data();
  const after = afterSnap && afterSnap.data();

  const template = before.template;
  if (!template) {
    throw new HttpsError(
      "invalid-argument",
      "Template property is missing from the document"
    );
  }

  const { sectionId: beforeSectionId } = before.venueSpecificData;
  const afterVenueSpecificData = after && after.venueSpecificData;
  const afterSectionId =
    afterVenueSpecificData && afterVenueSpecificData.sectionId;

  switch (template) {
    case "auditorium": {
      if (!beforeSectionId)
        throw new HttpsError(
          "invalid-argument",
          `Missing sectionId. Before: ${beforeSnap}. After: ${afterSnap}`
        );
      if (beforeSectionId === afterSectionId) return;

      await removeWithUserLookup(
        userId,
        admin
          .firestore()
          .collection("venues")
          .doc(venueId)
          .collection("sections")
          .doc(beforeSectionId)
          .collection("seatedSectionUsers")
          .doc(userId)
      );

      break;
    }
    case "jazzbar":
    case "conversationspace":
      //Don't delete seatedTableUser if recentSeatedUser is being updated
      //As there is now dangling data
      if (afterSnap) return;

      await removeWithUserLookup(
        userId,
        admin
          .firestore()
          .collection("venues")
          .doc(venueId)
          .collection("seatedTableUsers")
          .doc(userId)
      );

      break;
    default:
      throw new HttpsError(
        "invalid-argument",
        `Unsupported template ${template}`
      );
  }
};

exports.removeDanglingAfterSeatChange = functions.firestore
  .document("/venues/{venueId}/recentSeatedUsers/{userId}")
  .onUpdate(async (change, context) => {
    const { venueId, userId } = context.params;
    return removePreviousDanglingSeat(
      change.before,
      change.after,
      venueId,
      userId
    );
  });

exports.removeDanglingAfterSeatLeave = functions.firestore
  .document("/venues/{venueId}/recentSeatedUsers/{userId}")
  .onDelete(async (beforeSnap, context) => {
    const { venueId, userId } = context.params;
    return removePreviousDanglingSeat(beforeSnap, undefined, venueId, userId);
  });
