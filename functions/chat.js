const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { checkAuth } = require("./auth");

const checkIfValidCollectionId = (collectionId) =>
  /[a-z0-9_]{1,250}/.test(collectionId);

exports.turnMessageIntoThread = functions.https.onCall(
  async (data, context) => {
    checkAuth(context);

    const isValidVenueId = checkIfValidCollectionId(data.venueId);

    if (!isValidVenueId) {
      throw new HttpsError(
        "invalid-argument",
        `venueId is not a valid venue id`
      );
    }

    const isValidMessageId = checkIfValidCollectionId(data.messageId);

    if (!isValidMessageId) {
      throw new HttpsError(
        "invalid-argument",
        `messageId is not a valid message id`
      );
    }

    // Change this together with types/chat.ts MessageType enum
    const update = {
      type: "TREAD",
    };

    await admin
      .firestore()
      .collection("venues")
      .doc(venueId)
      .collection("chats")
      .doc(messageId)
      .update(update);
  }
);
