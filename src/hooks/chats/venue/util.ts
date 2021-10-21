import { useCallback } from "react";
import firebase from "firebase/app";
import { random } from "lodash";

import {
  ALWAYS_EMPTY_ARRAY,
  VENUE_CHAT_MESSAGES_COUNTER_SHARDS_COUNT,
} from "settings";

import { processBatchForUserLookup } from "api/userLookup";
import { getVenueRef } from "api/venue";

import {
  DeleteChatMessageProps,
  DeleteThreadMessageProps,
  MessageWithReplies,
  SendChatMessageProps,
  SendThreadMessageProps,
  VenueChatMessage,
} from "types/chat";
import { DistributedCounterShard } from "types/Firestore";

import { propName } from "utils/propName";

import { UseDeleteMessageProps } from "hooks/chats/common/useDeleteMessage";
import { UseSendMessageProps } from "hooks/chats/common/useSendMessage";
import { useUser } from "hooks/useUser";

export const getChatsRef = (venueId: string) =>
  getVenueRef(venueId).collection("chats");
export const getThreadRef = (venueId: string, threadId: string) =>
  getChatsRef(venueId).doc(threadId).collection("thread");

type ChatVariant = "sendChat" | "deleteChat";
type ThreadVariant = "sendThread" | "deleteThread";

type Variant = ChatVariant | ThreadVariant;

type ChatActionsProps<T extends Variant> = T extends "sendChat"
  ? UseSendMessageProps<VenueChatMessage, SendChatMessageProps>
  : T extends "sendThread"
  ? UseSendMessageProps<VenueChatMessage, SendThreadMessageProps>
  : T extends "deleteChat"
  ? UseDeleteMessageProps<DeleteChatMessageProps>
  : T extends "deleteThread"
  ? UseDeleteMessageProps<DeleteThreadMessageProps>
  : never;

export const useGetVenueChatCollectionRef = (venueId: string | undefined) =>
  useCallback(() => (venueId ? [getChatsRef(venueId)] : ALWAYS_EMPTY_ARRAY), [
    venueId,
  ]);

export const useGetVenueThreadCollectionRef = (venueId: string | undefined) =>
  useCallback(
    ({ threadId }: SendThreadMessageProps | DeleteThreadMessageProps) =>
      venueId && threadId
        ? [getThreadRef(venueId, threadId)]
        : ALWAYS_EMPTY_ARRAY,
    [venueId]
  );

export const useProcessBatchForThread = <T extends ThreadVariant>(
  venueId: string | undefined,
  variant: T
): ChatActionsProps<T>["processResultingBatch"] => {
  const { userId } = useUser();
  return useCallback(
    async ({ threadId }, messageRefs, batch) => {
      if (!venueId) return;
      batch.update(
        getChatsRef(venueId).doc(threadId),
        propName<MessageWithReplies>("repliesCount"),
        firebase.firestore.FieldValue.increment(
          variant === "sendThread" ? 1 : -1
        )
      );

      await processBatchForUserLookup(
        userId,
        batch,
        messageRefs,
        variant === "deleteThread"
      );
    },
    [userId, variant, venueId]
  );
};

export const useProcessBatchForChat = <T extends ChatVariant>(
  venueId: string | undefined,
  variant: T
): ChatActionsProps<T>["processResultingBatch"] => {
  const { userId } = useUser();

  return useCallback(
    async (
      props,
      messageRefs: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>[],
      batch: firebase.firestore.WriteBatch
    ) => {
      if (!venueId) return;

      const randomShard = getVenueRef(venueId)
        .collection("chatMessagesCounter")
        .doc(random(VENUE_CHAT_MESSAGES_COUNTER_SHARDS_COUNT - 1).toString());
      batch.update(
        randomShard,
        propName<DistributedCounterShard>("count"),
        firebase.firestore.FieldValue.increment(variant === "sendChat" ? 1 : -1)
      );

      await processBatchForUserLookup(
        userId,
        batch,
        messageRefs,
        variant === "deleteChat"
      );
    },
    [userId, variant, venueId]
  );
};
