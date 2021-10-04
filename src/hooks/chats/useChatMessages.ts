import { useMemo } from "react";
import { useFirestoreCollectionData } from "reactfire";
import firebase from "firebase/app";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { ChatMessage, MessageToDisplay } from "types/chat";

import {
  filterNewSchemaMessages,
  getMessageReplies,
  partitionMessagesFromReplies,
  PartitionMessagesFromRepliesReturn,
} from "utils/chat";
import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";
import { isTruthy } from "utils/types";

export const useChatMessagesForDisplay = <T extends ChatMessage>(
  messagesRef: firebase.firestore.Query,
  filter: (msg: T) => boolean = () => true
): [WithId<MessageToDisplay<T>>[], boolean] => {
  const [{ messages, allMessagesReplies }, isLoaded] = useChatMessages<T>(
    messagesRef,
    filter
  );

  const messagesToDisplay = useMemo(
    () =>
      messages
        .map((message) => {
          const messageReplies = getMessageReplies<T>({
            messageId: message.id,
            allReplies: allMessagesReplies,
          }).filter(isTruthy);

          return {
            ...message,
            replies: messageReplies,
          };
        })
        .filter(isTruthy),
    [messages, allMessagesReplies]
  );

  return [messagesToDisplay, isLoaded];
};

export const useChatMessages = <T extends ChatMessage>(
  messagesRef: firebase.firestore.Query,
  filter: (msg: T) => boolean = () => true
): [PartitionMessagesFromRepliesReturn<T>, boolean] => {
  const [chatMessages, isLoaded] = useChatMessagesRaw<T>(messagesRef);

  const filteredMessages = useMemo(
    () =>
      chatMessages.filter(
        (message) =>
          isTruthy(message) && message.deleted !== true && filter(message)
      ),
    [chatMessages, filter]
  );

  return [
    useMemo(() => partitionMessagesFromReplies<T>(filteredMessages), [
      filteredMessages,
    ]),
    isLoaded,
  ];
};

export const useChatMessagesRaw = <T extends ChatMessage>(
  messagesRef: firebase.firestore.Query
): [WithId<T>[], boolean] => {
  const {
    data: rawMessages = ALWAYS_EMPTY_ARRAY,
    status,
  } = useFirestoreCollectionData<WithId<T>>(
    messagesRef.orderBy("timestamp", "desc").withConverter(withIdConverter<T>())
  );

  const chatMessages =
    filterNewSchemaMessages<T>(rawMessages) ??
    (ALWAYS_EMPTY_ARRAY as WithId<T>[]);

  return [chatMessages, status !== "loading"];
};
