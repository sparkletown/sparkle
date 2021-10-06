import { useCallback } from "react";

import { ALWAYS_EMPTY_OBJECT } from "settings";

import {
  BaseChatMessage,
  DeleteMessageProps,
  DeleteThreadMessageProps,
  SendChatMessageProps,
  SendThreadMessageProps,
  VenueChatMessage,
} from "types/chat";

import { useDeleteMessage } from "hooks/chats/common/useDeleteMessage";
import { useSendMessage } from "hooks/chats/common/useSendMessage";
import {
  useGetVenueChatCollectionRef,
  useGetVenueThreadCollectionRef,
  useProcessBatchForChat,
  useProcessBatchForThread,
} from "hooks/chats/venue/util";

export const useSendVenueChatMessage = (venueId?: string) =>
  useSendMessage<VenueChatMessage, SendChatMessageProps>({
    getCollections: useGetVenueChatCollectionRef(venueId),
    processResultingBatch: useProcessBatchForChat(venueId, "sendChat"),
    getSpread: useCallback(
      ({ isQuestion }) => ({
        isQuestion,
        repliesCount: 0,
      }),
      []
    ),
  });

export const useDeleteVenueChatMessage = (venueId?: string) =>
  useDeleteMessage<DeleteMessageProps>({
    getCollections: useGetVenueChatCollectionRef(venueId),
    processResultingBatch: useProcessBatchForChat(venueId, "deleteChat"),
    hardDelete: true,
  });

export const useSendVenueThreadMessage = (venueId?: string) =>
  useSendMessage<BaseChatMessage, SendThreadMessageProps>({
    getCollections: useGetVenueThreadCollectionRef(venueId),
    processResultingBatch: useProcessBatchForThread(venueId, "sendThread"),
    getSpread: useCallback(() => ALWAYS_EMPTY_OBJECT, []),
  });

export const useDeleteVenueThreadMessage = (venueId?: string) =>
  useDeleteMessage<DeleteThreadMessageProps>({
    getCollections: useGetVenueThreadCollectionRef(venueId),
    processResultingBatch: useProcessBatchForThread(venueId, "deleteThread"),
  });
