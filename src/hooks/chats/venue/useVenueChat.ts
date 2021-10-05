import { useCallback, useMemo } from "react";
import firebase from "firebase/app";

import { CHAT_MESSAGE_TIMEOUT } from "settings";

import { getVenueRef } from "api/venue";

import {
  BaseChatMessage,
  ChatActions,
  SendThreadReply,
  VenueChatMessage,
} from "types/chat";

import { buildBaseMessage } from "utils/chat";
import { waitAtLeast } from "utils/promise";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";
import { useDeleteMessage } from "hooks/chats/common/useDeleteMessage";
import { useSendMessage } from "hooks/chats/common/useSendMessage";
import { useUser } from "hooks/useUser";

const getChatsRef = (venueId?: string) =>
  getVenueRef(venueId).collection("chats");
const getThreadsRef = (venueId?: string, threadId?: string) =>
  getVenueRef(venueId).collection("chats").doc(threadId).collection("threads");

export const useVenueChatActions = (venueId?: string): ChatActions => {
  const refs = useMemo(() => [getChatsRef(venueId)], [venueId]);

  const sendMessage = useSendMessage<VenueChatMessage>(refs, {
    threadRepliesCount: 0,
  });
  const deleteMessage = useDeleteMessage(refs, true);
  const sendThreadReply = useSendVenueThreadReply(venueId);

  return { sendMessage, deleteMessage, sendThreadReply };
};

const useSendVenueThreadReply = (venueId?: string): SendThreadReply => {
  const { userWithId } = useUser();

  return useCallback(
    async ({ replyText, threadId }) => {
      if (!userWithId) return;

      const message = buildBaseMessage<BaseChatMessage>(replyText, userWithId);

      if (!message) return;

      await waitAtLeast(
        CHAT_MESSAGE_TIMEOUT,
        getThreadsRef(venueId, threadId).add(message)
      );
    },
    [userWithId, venueId]
  );
};

export const useVenueChatMessages = (
  venueId: string | undefined,
  limit?: number
) => {
  let ref: firebase.firestore.Query = getChatsRef(venueId);
  if (limit) ref = ref.limit(limit);
  return useChatMessagesRaw<VenueChatMessage>(ref);
};

export const useVenueChatThreadMessages = (
  venueId: string | undefined,
  threadId: string | undefined,
  limit?: number
) => {
  let ref: firebase.firestore.Query = getThreadsRef(venueId, threadId);
  if (limit) ref = ref.limit(limit);

  return useChatMessagesRaw<BaseChatMessage>(ref);
};
