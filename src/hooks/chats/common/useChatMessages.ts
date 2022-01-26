import { useMemo } from "react";
import { useFirestoreCollectionData } from "reactfire";
import firebase from "firebase/app";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { BaseChatMessage, ChatMessage, MessageToDisplay } from "types/chat";

import {
  filterNewSchemaMessages,
  getMessageReplies,
  partitionMessagesFromReplies,
  PartitionMessagesFromRepliesReturn,
} from "utils/chat";
import { WithId } from "utils/id";
import { isTruthy } from "utils/types";

export const useChatMessagesForDisplay = <T extends ChatMessage>(
  messagesRef: firebase.firestore.Query,
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
  messagesRef: firebase.firestore.Query,
  filter: (msg: T) => boolean = () => true
): [PartitionMessagesFromRepliesReturn<T>, boolean] => {
  const [chatMessages, isLoaded] = useChatMessagesRaw<T>(messagesRef);

  const filteredMessages = useMemo(
    () => chatMessages.filter(filter),
    [chatMessages, filter]
  );

  return [
    useMemo(
      () => partitionMessagesFromReplies<T>(filteredMessages),
      [filteredMessages]
    ),
    isLoaded,
  ];
};

export const useChatMessagesRaw = <T extends BaseChatMessage>(
  messagesRef: firebase.firestore.Query
): [WithId<T>[], boolean] => {
  const { data: rawMessages = ALWAYS_EMPTY_ARRAY, status } =
    useFirestoreCollectionData<WithId<T>>(
      messagesRef.orderBy("timestamp", "desc"),
      {
        idField: "id",
      }
    );

  const chatMessages = useMemo(
    () =>
      filterNewSchemaMessages<T>(rawMessages)?.filter(isTruthy) ??
      (ALWAYS_EMPTY_ARRAY as WithId<T>[]),
    [rawMessages]
  );

  return [chatMessages, status !== "loading"];
};
