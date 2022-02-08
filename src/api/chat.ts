import Bugsnag from "@bugsnag/js";
import { FIREBASE } from "core/firebase";
import firebase from "firebase/compat/app";
import { httpsCallable } from "firebase/functions";
import { noop } from "lodash";

import { getVenueRef } from "api/venue";

import { BaseChatMessage, PollVoteBase } from "types/chat";

export const getUserChatsCollectionRef = (userId: string) =>
  firebase
    .firestore()
    .collection("privatechats")
    .doc(userId)
    .collection("chats");

export interface SendVenueMessageProps {
  venueId: string;
  message: BaseChatMessage;
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

export interface VoteInPollProps {
  pollVote: PollVoteBase;
  venueId: string;
}

export const voteInVenuePoll = async ({ pollVote, venueId }: VoteInPollProps) =>
  await httpsCallable(
    FIREBASE.functions,
    "venue-voteInPoll"
  )({
    pollVote,
    venueId,
  });
