import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";
import noop from "lodash/noop";

import { PollVoteBase, PrivateChatMessage, VenueChatMessage } from "types/chat";

import { getVenueRef } from "./venue";

export const getUserChatsCollectionRef = (userId: string) =>
  firebase
    .firestore()
    .collection("privatechats")
    .doc(userId)
    .collection("chats");

export interface SendVenueMessageProps {
  venueId: string;
  message: VenueChatMessage;
}

export const sendVenueMessage = async ({
  venueId,
  message,
}: SendVenueMessageProps): Promise<void> =>
  getVenueRef(venueId)
    .collection("chats")
    .add(message)
    .then(noop)
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

  const authorRef = getUserChatsCollectionRef(message.from).doc();
  const recipientRef = getUserChatsCollectionRef(message.to).doc();

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
  getUserChatsCollectionRef(userId)
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
  getVenueRef(venueId)
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
  getUserChatsCollectionRef(userId)
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

export interface VoteInPollProps {
  pollVote: PollVoteBase;
  venueId: string;
}

export const voteInVenuePoll = async ({ pollVote, venueId }: VoteInPollProps) =>
  await firebase.functions().httpsCallable("venue-voteInPoll")({
    pollVote,
    venueId,
  });
