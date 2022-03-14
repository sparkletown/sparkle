import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/v1/https";
import { chunk } from "lodash";

import { BATCH_MAX_OPS } from "./scheduled";

export const incrementSectionsCount = functions.firestore
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

export const decrementSectionsCount = functions.firestore
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
  beforeSnap: functions.firestore.QueryDocumentSnapshot,
  afterSnap: functions.firestore.QueryDocumentSnapshot | undefined,
  venueId: string,
  userId: string
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
};

export const removeDanglingAfterSeatChange = functions.firestore
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

export const removeDanglingAfterSeatLeave = functions.firestore
  .document("/venues/{venueId}/recentSeatedUsers/{userId}")
  .onDelete(async (beforeSnap, context) => {
    const { venueId, userId } = context.params;
    return removePreviousDanglingSeat(beforeSnap, undefined, venueId, userId);
  });

export const removeThreadWhenMessageIsRemoved = functions.firestore
  .document("/venues/{venueId}/chats/{messageId}")
  .onDelete(async (beforeSnap, context) => {
    const { venueId, messageId } = context.params;
    const firestore = admin.firestore();

    const threadMessages = await firestore
      .collection("venues")
      .doc(venueId)
      .collection("chats")
      .doc(messageId)
      .collection("thread")
      .listDocuments();

    return Promise.all(
      chunk(threadMessages, BATCH_MAX_OPS).map((chunk) => {
        const batch = firestore.batch();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        chunk.forEach(batch.delete);
        return batch.commit();
      })
    );
  });
