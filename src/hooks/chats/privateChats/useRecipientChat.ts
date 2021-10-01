import { useCallback } from "react";
import { useFirestore } from "reactfire";

import {
  deletePrivateMessage,
  sendPrivateMessage,
  setChatMessageRead,
} from "api/chat";

import {
  DeleteMessage,
  PrivateChatMessage,
  SendChatReply,
  SendMessage,
} from "types/chat";
import { DisplayUser } from "types/User";

import { buildMessage, pickDisplayUserFromUser } from "utils/chat";
import { WithId } from "utils/id";

import { useChatMessages } from "hooks/chats/useChatMessages";
import { useUser } from "hooks/useUser";

export const useRecipientChat = (recipient: WithId<DisplayUser>) => {
  const chatActions = useRecipientChatActions(recipient);
  const { userId } = useUser();
  const firestore = useFirestore();

  const [messagesToDisplay] = useChatMessages<PrivateChatMessage>(
    firestore.collection("privatechats").doc(userId).collection("chats"),
    (message) =>
      message.toUser.id === recipient.id || message.fromUser.id === recipient.id
  );

  return {
    ...chatActions,
    messagesToDisplay,
  };
};

const useRecipientChatActions = (recipient: WithId<DisplayUser>) => {
  const { userWithId } = useUser();

  const sendMessageToSelectedRecipient: SendMessage = useCallback(
    async ({ message, isQuestion }) => {
      if (!userWithId) return;

      const privateChatMessage = buildMessage<PrivateChatMessage>(userWithId, {
        text: message,
        isQuestion,
        toUser: pickDisplayUserFromUser(recipient),
      });

      return sendPrivateMessage(privateChatMessage);
    },
    [recipient, userWithId]
  );

  const deleteMessage: DeleteMessage = useCallback(
    async (messageId: string) => {
      if (!userWithId) return;

      return deletePrivateMessage({ userId: userWithId.id, messageId });
    },
    [userWithId]
  );

  const markMessageRead = useCallback(
    (messageId: string) => {
      if (!userWithId) return;

      return setChatMessageRead({ userId: userWithId.id, messageId });
    },
    [userWithId]
  );

  const sendThreadReply: SendChatReply = useCallback(
    async ({ replyText, threadId }) => {
      if (!userWithId) return;

      const threadReply = buildMessage<PrivateChatMessage>(userWithId, {
        toUser: recipient,
        text: replyText,
        threadId,
      });

      return sendPrivateMessage(threadReply);
    },
    [recipient, userWithId]
  );

  return {
    sendMessageToSelectedRecipient,
    sendThreadReply,
    markMessageRead,
    deleteMessage,
  };
};
