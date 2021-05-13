import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { VenueChatMessage, PrivateChatMessage } from "types/chat";

export interface SendVenueMessageProps {
  venueId: string;
  message: VenueChatMessage;
}

export const sendVenueMessage = async ({
  venueId,
  message,
}: SendVenueMessageProps): Promise<void | firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> =>
  firebase
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection("chats")
    .add(message)
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/chat::sendVenueMessage",
          venueId,
          message,
        });
      });
      // @debt rethrow error, when we can handle it to show UI error
    });

export const sendPrivateMessage = async (
  message: PrivateChatMessage
): Promise<void> => {
  const batch = firebase.firestore().batch();

  const authorRef = firebase
    .firestore()
    .collection("privatechats")
    .doc(message.from)
    .collection("chats")
    .doc();

  const recipientRef = firebase
    .firestore()
    .collection("privatechats")
    .doc(message.to)
    .collection("chats")
    .doc();

  batch.set(authorRef, message);
  batch.set(recipientRef, message);

  return batch.commit().catch((err) => {
    Bugsnag.notify(err, (event) => {
      event.addMetadata("context", {
        location: "api/chat::sendPrivateMessage",
        message,
      });
    });
    // @debt rethrow error, when we can handle it to show UI error
  });
};

export type SetChatMessageIsReadProps = {
  userId: string;
  messageId: string;
};

export const setChatMessageRead = async ({
  userId,
  messageId,
}: SetChatMessageIsReadProps): Promise<void> =>
  firebase
    .firestore()
    .collection("privatechats")
    .doc(userId)
    .collection("chats")
    .doc(messageId)
    .update({ isRead: true })
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/chat::setChatMessageRead",
          userId,
          messageId,
        });
      });
      // @debt rethrow error, when we can handle it to show UI error
    });

export type DeleteVenueMessageProps = {
  venueId: string;
  messageId: string;
};

export const deleteVenueMessage = async ({
  venueId,
  messageId,
}: DeleteVenueMessageProps): Promise<void> =>
  firebase
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection("chats")
    .doc(messageId)
    .update({ deleted: true })
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/chat::deleteVenueMessage",
          venueId,
          messageId,
        });
      });
      // @debt rethrow error, when we can handle it to show UI error
    });

export type DeletePrivateMessageProps = {
  userId: string;
  messageId: string;
};

export const deletePrivateMessage = async ({
  userId,
  messageId,
}: DeletePrivateMessageProps): Promise<void> =>
  firebase
    .firestore()
    .collection("privatechats")
    .doc(userId)
    .collection("chats")
    .doc(messageId)
    .update({ deleted: true })
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/chat::deletePrivateMessage",
          userId,
          messageId,
        });
      });
      // @debt rethrow error, when we can handle it to show UI error
    });
