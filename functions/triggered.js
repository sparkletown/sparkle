const admin = require("firebase-admin");

const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");
const { pick, isEqual, chunk, set } = require("lodash");
const { BATCH_MAX_OPS } = require("functions/scheduled");

const DISPLAY_USER_FIELDS = ["partyName" | "pictureUrl" | "anonMode"];

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
    case "auditorium":
      if (!beforeSectionId)
        throw new HttpsError(
          "invalid-argument",
          `Missing sectionId. Before: ${beforeSnap}. After: ${afterSnap}`
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
      //Don't delete seatedTableUser if recentSeatedUser is being updated
      //As there is now dangling data
      if (afterSnap) return;

      await admin
        .firestore()
        .collection("venues")
        .doc(venueId)
        .collection("seatedTableUsers")
        .doc(userId)
        .delete();

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

exports.onUserUpdate = functions.firestore
  .document("/users/{userId}")
  .onUpdate(async (change, context) => {
    const { userId } = context.params;

    const before = pick(change.before, DISPLAY_USER_FIELDS);
    const after = pick(change.after, DISPLAY_USER_FIELDS);
    if (isEqual(before, after)) return;

    const { docs: paths } = await admin
      .firestore()
      .collection("usersLookup")
      .doc(userId)
      .collection("paths")
      .get();

    await Promise.all(
      chunk(paths, BATCH_MAX_OPS).map((pathsChunk) => {
        const batch = admin.firestore().batch();
        for (const ref of pathsChunk) {
          const { firebasePath, docPath } = ref.data();

          const data = docPath ? set({}, docPath, after) : after;
          batch.update(admin.firestore().doc(firebasePath), data);
        }
        return batch.commit();
      })
    );
  });
