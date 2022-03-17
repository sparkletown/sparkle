import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
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
