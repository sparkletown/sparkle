import { useCallback, useMemo } from "react";
import firebase from "firebase/app";

import { CHAT_MESSAGE_TIMEOUT } from "settings";

import { getVenueRef } from "api/venue";

import {
  BaseChatMessage,
  ChatActions,
  DeleteThreadReply,
  MessageWithReplies,
  SendThreadReply,
  VenueChatMessage,
} from "types/chat";

import { buildBaseMessage } from "utils/chat";
import { waitAtLeast } from "utils/promise";
import { propName } from "utils/propName";

import { useDeleteMessage } from "hooks/chats/common/useDeleteMessage";
import { useSendMessage } from "hooks/chats/common/useSendMessage";
import { useUser } from "hooks/useUser";

export const getChatsRef = (venueId?: string) =>
  getVenueRef(venueId).collection("chats");
export const getThreadsRef = (venueId?: string, threadId?: string) =>
  getVenueRef(venueId).collection("chats").doc(threadId).collection("threads");

export const useVenueChatActions = (venueId?: string): ChatActions => {
  const refs = useMemo(() => [getChatsRef(venueId)], [venueId]);

  const sendMessage = useSendMessage<VenueChatMessage>(refs, {
    repliesCount: 0,
  });
  const deleteMessage = useDeleteMessage(refs, true);
  const deleteThreadReply = useDeleteVenueThreadReply(venueId);
  const sendThreadReply = useSendVenueThreadReply(venueId);

  return { sendMessage, deleteMessage, sendThreadReply, deleteThreadReply };
};

const useDeleteVenueThreadReply = (venueId?: string): DeleteThreadReply => {
  const { userWithId } = useUser();

  return useCallback(
    async (threadId, messageId) => {
      if (!userWithId) return;

      const batch = firebase.firestore().batch();
      batch.delete(getThreadsRef(venueId, threadId).doc(messageId));
      batch.update(
        getChatsRef(venueId).doc(threadId),
        propName<MessageWithReplies>("repliesCount"),
        firebase.firestore.FieldValue.increment(-1)
      );

      await waitAtLeast(CHAT_MESSAGE_TIMEOUT, batch.commit());
    },
    [userWithId, venueId]
  );
};

const useSendVenueThreadReply = (venueId?: string): SendThreadReply => {
  const { userWithId } = useUser();

  return useCallback(
    async ({ replyText, threadId }) => {
      if (!userWithId) return;

      const batch = firebase.firestore().batch();
      const message = buildBaseMessage<BaseChatMessage>(replyText, userWithId);

      if (!message) return;

      batch.set(getThreadsRef(venueId, threadId).doc(), message);
      batch.update(
        getChatsRef(venueId).doc(threadId),
        propName<MessageWithReplies>("repliesCount"),
        firebase.firestore.FieldValue.increment(1)
      );

      await waitAtLeast(CHAT_MESSAGE_TIMEOUT, batch.commit());
    },
    [userWithId, venueId]
  );
};
