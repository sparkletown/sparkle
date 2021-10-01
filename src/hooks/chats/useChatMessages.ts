import { useMemo } from "react";
import { useFirestoreCollectionData } from "reactfire";
import firebase from "firebase/app";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { ChatMessage, MessageToDisplay } from "types/chat";

import {
  chatSort,
  filterNewSchemaMessages,
  getMessageReplies,
  partitionMessagesFromReplies,
} from "utils/chat";
import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";
import { isTruthy } from "utils/types";

export const useChatMessages = <T extends ChatMessage>(
  messagesRef: firebase.firestore.Query,
  filter: (msg: T) => boolean
): [WithId<MessageToDisplay<T>>[], boolean] => {
  const [chatMessages, isLoaded] = useChatMessagesRaw<T>(messagesRef);

  const filteredMessages = useMemo(
    () =>
      chatMessages
        .filter((message) => message.deleted !== true && filter(message))
        .sort(chatSort),
    [chatMessages, filter]
  );

  const { messages, allMessagesReplies } = useMemo(
    () => partitionMessagesFromReplies<T>(filteredMessages),
    [filteredMessages]
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

export const useChatMessagesRaw = <T extends ChatMessage>(
  messagesRef: firebase.firestore.Query
): [WithId<T>[], boolean] => {
  const {
    data: rawMessages = ALWAYS_EMPTY_ARRAY,
    status,
  } = useFirestoreCollectionData<WithId<T>>(
    messagesRef.withConverter(withIdConverter<T>())
  );

  const chatMessages =
    filterNewSchemaMessages<T>(rawMessages) ??
    (ALWAYS_EMPTY_ARRAY as WithId<T>[]);

  return [chatMessages, status !== "loading"];
};
