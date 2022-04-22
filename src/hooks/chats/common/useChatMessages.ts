import { useMemo } from "react";
import { orderBy, Query, query } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, DEFERRED } from "settings";

import { BaseChatMessage, ChatMessage, MessageToDisplay } from "types/chat";
import { DeferredAction } from "types/id";

import {
  filterNewSchemaMessages,
  getMessageReplies,
  partitionMessagesFromReplies,
  PartitionMessagesFromRepliesReturn,
} from "utils/chat";
import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";
import { isDeferred } from "utils/query";
import { isTruthy } from "utils/types";

import { useLiveQuery } from "hooks/fire/useLiveQuery";

export const useChatMessagesForDisplay = <T extends ChatMessage>(
  messagesRef: Query<T>,
  filter: (msg: T) => boolean = () => true
): [WithId<MessageToDisplay<T>>[], Record<string, WithId<T>[]>, boolean] => {
  const [{ messages, allMessagesReplies }, isLoaded] = useChatMessages<T>(
    messagesRef,
    filter
  );

  const replies = useMemo(
    () =>
      Object.assign(
        {},
        ...messages
          .map((message) => ({
            [message.id]: getMessageReplies<T>({
              messageId: message.id,
              allReplies: allMessagesReplies,
            }).filter(isTruthy),
          }))
          .filter(isTruthy)
      ),
    [messages, allMessagesReplies]
  );

  const messagesToDisplay = messages.map((x) => ({
    ...x,
    repliesCount: replies[x.id]?.length ?? 0,
  }));

  return [messagesToDisplay, replies, isLoaded];
};

export const useChatMessages = <T extends ChatMessage>(
  messagesRef: Query<T>,
  filter: (msg: T) => boolean = () => true
): [PartitionMessagesFromRepliesReturn<T>, boolean] => {
  const [chatMessages, isLoaded] = useChatMessagesRaw<T>(messagesRef);

  const filteredMessages = useMemo(() => chatMessages.filter(filter), [
    chatMessages,
    filter,
  ]);

  return [
    useMemo(() => partitionMessagesFromReplies<T>(filteredMessages), [
      filteredMessages,
    ]),
    isLoaded,
  ];
};

export const useChatMessagesRaw = <T extends BaseChatMessage>(
  messagesRef: Query<T> | DeferredAction
): [WithId<T>[], boolean] => {
  const { data: rawMessages = ALWAYS_EMPTY_ARRAY, isLoaded } = useLiveQuery(
    useMemo(() => {
      if (isDeferred(messagesRef)) return DEFERRED;

      return query(messagesRef, orderBy("timestamp", "desc")).withConverter<
        WithId<T>
      >(withIdConverter());
    }, [messagesRef])
  );

  const chatMessages = useMemo(
    () =>
      filterNewSchemaMessages<T>(rawMessages)?.filter(isTruthy) ??
      (ALWAYS_EMPTY_ARRAY as WithId<T>[]),
    [rawMessages]
  );

  return [chatMessages, isLoaded];
};
