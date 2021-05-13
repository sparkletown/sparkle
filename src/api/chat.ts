import firebase from "firebase/app";

import { VenueChatMessage, PrivateChatMessage } from "types/chat";
import { VideoChatRequest, VideoChatRequestState } from "types/ChatRequest";

export interface SendVenueMessageProps {
  venueId: string;
  message: VenueChatMessage;
}

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

export const createVideoChat = async (
  hostId: string,
  guestId: string,
  venueName: string
) => {
  const videoChatRequest: VideoChatRequest = {
    hostId: hostId,
    guestId: guestId,
    state: VideoChatRequestState.Asked,
    createdAt: Date.now(),
  };

  return await firebase
    .firestore()
    .collection("experiences")
    .doc(venueName)
    .collection("chatRequests")
    .add(videoChatRequest);
};

export const acceptVideoChat = async (
  venueName: string,
  videoChatId: string
) => {
  return await firebase
    .firestore()
    .collection("experiences")
    .doc(venueName)
    .collection("chatRequests")
    .doc(videoChatId)
    .update({ state: VideoChatRequestState.Accepted });
};

export const declineVideoChat = async (
  venueName: string,
  videoChatId: string
) => {
  return await firebase
    .firestore()
    .collection("experiences")
    .doc(venueName)
    .collection("chatRequests")
    .doc(videoChatId)
    .update({ state: VideoChatRequestState.Declined });
};

export const leaveVideoChat = async (
  venueName: string,
  videoChatId: string
) => {
  return await firebase
    .firestore()
    .collection("experiences")
    .doc(venueName)
    .collection("chatRequests")
    .doc(videoChatId)
    .update({ state: VideoChatRequestState.Canceled });
};
