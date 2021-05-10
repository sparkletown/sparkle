import firebase from "firebase/app";
import Bugsnag from "@bugsnag/js";

import {
  VenueChatMessage,
  PrivateChatMessage,
  ChildThreadMessage,
  MessageType,
} from "types/chat";

import { WithId } from "utils/id";

export interface SendVenueMessageProps {
  venueId: string;
  message: VenueChatMessage;
}

export const sendVenueMessage = async ({
  venueId,
  message,
}: SendVenueMessageProps) =>
  firebase
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection("chats")
    .add(message);

export interface TurnMessageIntoThreadProps {
  venueId: string;
  messageId: string;
}

export const turnMessageIntoThread = async ({
  venueId,
  messageId,
}: TurnMessageIntoThreadProps) =>
  firebase
    .functions()
    .httpsCallable("chat-turnMessageIntoThread")({ venueId, messageId })
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/chat::turnMessageIntoThread",
          venueId,
        });
      });

      // @debt Rethrow error, when we have a service to friendly notify a user about the API error
    });

export interface SendMessageToThreadProps {
  venueId: string;
  parentMessage: WithId<VenueChatMessage>;
  message: VenueChatMessage;
}

export const sendMessageToVenueThread = async ({
  venueId,
  parentMessage,
  message,
}: SendMessageToThreadProps) => {
  const threadMessageId = parentMessage.id;

  if (parentMessage.type !== MessageType.THREAD) {
    await turnMessageIntoThread({ venueId, messageId: threadMessageId });
  }

  const childThreadMessage: ChildThreadMessage = {
    ...message,
    type: MessageType.THREAD_CHILD,
    threadId: threadMessageId,
  };

  return sendVenueMessage({
    venueId,
    message: childThreadMessage,
  });
};

export const sendPrivateMessage = async (message: PrivateChatMessage) => {
  // @debt This is the legacy way of saving private messages. Would be nice to have it saved in one operation
  [message.from, message.to].forEach((messageUser) =>
    firebase
      .firestore()
      .collection("privatechats")
      .doc(messageUser)
      .collection("chats")
      .add(message)
  );
};

export type SetChatMessageIsReadProps = {
  userId: string;
  messageId: string;
};

export const setChatMessageRead = async ({
  userId,
  messageId,
}: SetChatMessageIsReadProps) =>
  firebase
    .firestore()
    .collection("privatechats")
    .doc(userId)
    .collection("chats")
    .doc(messageId)
    .update({ isRead: true });

export type DeleteVenueMessageProps = {
  venueId: string;
  messageId: string;
};

export const deleteVenueMessage = async ({
  venueId,
  messageId,
}: DeleteVenueMessageProps) =>
  await firebase
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection("chats")
    .doc(messageId)
    .update({ deleted: true });

export type DeletePrivateMessageProps = {
  userId: string;
  messageId: string;
};

export const deletePrivateMessage = async ({
  userId,
  messageId,
}: DeletePrivateMessageProps) =>
  await firebase
    .firestore()
    .collection("privatechats")
    .doc(userId)
    .collection("chats")
    .doc(messageId)
    .update({ deleted: true });
