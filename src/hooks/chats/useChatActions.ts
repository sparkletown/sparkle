import { useCallback } from "react";
import firebase from "firebase/app";

import {
  ChatActions,
  ChatMessage,
  DeleteMessage,
  SendChatReply,
  SendMessage,
} from "types/chat";

import { buildMessage, ExcludeBuiltMessage } from "utils/chat";

import { useUser } from "hooks/useUser";

export const useChatActions = <T extends ChatMessage>(
  messagesCollectionRefs: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>[],
  spreadOnMessage: ExcludeBuiltMessage<T>
): ChatActions => {
  const { userWithId } = useUser();

  const sendMessage: SendMessage = useCallback(
    async ({ message, isQuestion }) => {
      if (!userWithId) return;

      const processedMessage = buildMessage<T>(message, userWithId, {
        ...(isQuestion && { isQuestion }),
        ...spreadOnMessage,
      });

      const batch = firebase.firestore().batch();

      messagesCollectionRefs.forEach((ref) =>
        batch.set(ref.doc(), processedMessage)
      );

      await batch.commit();
    },
    [messagesCollectionRefs, spreadOnMessage, userWithId]
  );

  const deleteMessage: DeleteMessage = useCallback(
    async (messageId: string) => {
      const batch = firebase.firestore().batch();

      messagesCollectionRefs.forEach((ref) => batch.delete(ref.doc(messageId)));

      await batch.commit();
    },
    [messagesCollectionRefs]
  );

  const sendThreadReply: SendChatReply = useCallback(
    async ({ replyText, threadId }) => {
      if (!userWithId) return;

      const threadReply = buildMessage<T>(replyText, userWithId, {
        threadId,
        ...spreadOnMessage,
      });

      if (!threadReply) return;

      const batch = firebase.firestore().batch();

      messagesCollectionRefs.forEach((ref) =>
        batch.set(ref.doc(), threadReply)
      );

      await batch.commit();
    },
    [messagesCollectionRefs, spreadOnMessage, userWithId]
  );

  return {
    sendMessage,
    deleteMessage,
    sendThreadReply,
  };
};
