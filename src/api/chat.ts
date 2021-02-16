import firebase from "firebase/app";

import { VenueChatMessage, PrivateChatMessage } from "types/chat";

export type SendVenueMessageProps = {
  venueId: string;
  message: VenueChatMessage;
};

export const sendVenueMessage = async ({
  venueId,
  message,
}: SendVenueMessageProps) =>
  await firebase
    .firestore()
    .collection("venues")
    .doc(venueId)
    .collection("chats")
    .add(message);

export const sendPrivateMessage = async (message: PrivateChatMessage) => {
  // @debt This is the legacy way of saving private messages. Would be nice to have it saved in one operation
  for (const messageUser of [message.from, message.to]) {
    await firebase
      .firestore()
      .collection("privatechats")
      .doc(messageUser)
      .collection("chats")
      .add(message);
  }
};

export type SetChatMessageIsReadProps = {
  userId: string;
  messageId: string;
};

export const setChatMessageIsRead = ({
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
