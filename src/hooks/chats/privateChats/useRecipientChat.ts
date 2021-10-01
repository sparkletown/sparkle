import { useCallback, useMemo } from "react";

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

import {
  buildMessage,
  chatSort,
  getMessageReplies,
  partitionMessagesFromReplies,
  pickDisplayUserFromUser,
} from "utils/chat";
import { WithId } from "utils/id";
import { isTruthy } from "utils/types";

import { useUser } from "hooks/useUser";

import { usePrivateChatMessages } from "./usePrivateChatMessages";
export const useRecipientChatMessages = (recipient: WithId<DisplayUser>) => {
  const { privateChatMessages } = usePrivateChatMessages();

  const filteredMessages = useMemo(
    () =>
      privateChatMessages
        .filter(
          (message) =>
            message.deleted !== true &&
            (message.toUser.id === recipient.id ||
              message.fromUser.id === recipient.id)
        )
        .sort(chatSort),
    [privateChatMessages, recipient.id]
  );

  const { messages, allMessagesReplies } = useMemo(
    () => partitionMessagesFromReplies(filteredMessages),
    [filteredMessages]
  );

  return useMemo(
    () =>
      messages
        .map((message) => {
          const messageReplies = getMessageReplies<PrivateChatMessage>({
            messageId: message.id,
            allReplies: allMessagesReplies,
          }).filter(isTruthy);

          return { ...message, replies: messageReplies };
        })
        .filter(isTruthy),
    [allMessagesReplies, messages]
  );
};

export const useRecipientChat = (recipient: WithId<DisplayUser>) => {
  const chatActions = useRecipientChatActions(recipient);
  const messagesToDisplay = useRecipientChatMessages(recipient);

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
