import { useCallback } from "react";
import firebase from "firebase/app";

import { CHAT_MESSAGE_TIMEOUT } from "settings";

import { ChatActions, ChatMessage } from "types/chat";

import { buildMessage, ExcludeBuiltMessage } from "utils/chat";
import { waitAtLeast } from "utils/promise";

import { useUser } from "hooks/useUser";

export const useChatActions = <T extends ChatMessage>(
  messagesCollections: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>[],
  spreadOnMessage: ExcludeBuiltMessage<T>
): ChatActions => {
  const { userWithId } = useUser();

  const sendMessage = useCallback(
    async ({ message, isQuestion }) => {
      console.log("sendMessage", message, isQuestion);
      if (!userWithId) return;

      const processedMessage = buildMessage<T>(message, userWithId, {
        ...(isQuestion && { isQuestion }),
        ...spreadOnMessage,
      });
      console.log("messa", messagesCollections);

      const batch = firebase.firestore().batch();

      messagesCollections.forEach((ref) =>
        batch.set(ref.doc(), processedMessage)
      );

      await waitAtLeast(CHAT_MESSAGE_TIMEOUT, batch.commit());
    },
    [messagesCollections, spreadOnMessage, userWithId]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      const batch = firebase.firestore().batch();

      messagesCollections.forEach((ref) => batch.delete(ref.doc(messageId)));

      await waitAtLeast(CHAT_MESSAGE_TIMEOUT, batch.commit());
    },
    [messagesCollections]
  );

  const sendThreadReply = useCallback(
    async ({ replyText, threadId }) => {
      if (!userWithId) return;

      const threadReply = buildMessage<T>(replyText, userWithId, {
        threadId,
        ...spreadOnMessage,
      });

      if (!threadReply) return;

      const batch = firebase.firestore().batch();

      messagesCollections.forEach((ref) => batch.set(ref.doc(), threadReply));

      await waitAtLeast(CHAT_MESSAGE_TIMEOUT, batch.commit());
    },
    [messagesCollections, spreadOnMessage, userWithId]
  );

  return {
    sendMessage,
    deleteMessage,
    sendThreadReply,
  };
};
