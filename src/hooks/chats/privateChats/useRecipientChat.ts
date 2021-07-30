import { useCallback, useMemo } from "react";

import {
  sendPrivateMessage,
  setChatMessageRead,
  deletePrivateMessage,
} from "api/chat";

import {
  chatSort,
  buildMessage,
  partitionMessagesFromReplies,
  getMessageReplies,
  getBaseMessageToDisplay,
} from "utils/chat";
import { WithId, withId } from "utils/id";
import { isTruthy } from "utils/types";

import {
  DeleteMessage,
  PrivateChatMessage,
  SendChatReply,
  SendMessage,
} from "types/chat";

import { useUser } from "../../useUser";
import { useWorldUsersById } from "../../users";
import { usePrivateChatMessages } from "./usePrivateChatMessages";

export const useRecipientChat = (recipientId: string) => {
  const { worldUsersById } = useWorldUsersById();
  const { privateChatMessages } = usePrivateChatMessages();
  const { user } = useUser();

  const userId = user?.uid;
  const recipient = withId(worldUsersById[recipientId], recipientId);

  const sendMessageToSelectedRecipient: SendMessage = useCallback(
    ({ message, isQuestion }) => {
      if (!userId) return;

      const privateChatMessage = buildMessage<PrivateChatMessage>({
        from: userId,
        text: message,
        isQuestion,
        to: recipientId,
      });

      return sendPrivateMessage(privateChatMessage);
    },
    [userId, recipientId]
  );

  const deleteMessage: DeleteMessage = useCallback(
    (messageId: string) => {
      if (!userId) return;

      return deletePrivateMessage({ userId, messageId });
    },
    [userId]
  );

  const markMessageRead = useCallback(
    (messageId: string) => {
      if (!userId) return;

      setChatMessageRead({ userId, messageId });
    },
    [userId]
  );

  const sendThreadReply: SendChatReply = useCallback(
    async ({ replyText, threadId }) => {
      if (!userId) return;

      const threadReply = buildMessage<PrivateChatMessage>({
        from: userId,
        to: recipientId,
        text: replyText,
        threadId,
      });

      return sendPrivateMessage(threadReply);
    },
    [userId, recipientId]
  );

  const filteredMessages = useMemo(
    () =>
      privateChatMessages
        .filter(
          (message) =>
            message.deleted !== true &&
            (message.to === recipientId || message.from === recipientId)
        )
        .sort(chatSort),
    [privateChatMessages, recipientId]
  );

  const { messages, allMessagesReplies } = useMemo(
    () => partitionMessagesFromReplies(filteredMessages),
    [filteredMessages]
  );

  const messagesToDisplay = useMemo(
    () =>
      messages
        .map((message) => {
          const displayMessage = getBaseMessageToDisplay<
            WithId<PrivateChatMessage>
          >({
            message,
            usersById: worldUsersById,
            myUserId: userId,
          });

          if (!displayMessage) return undefined;

          const messageReplies = getMessageReplies<PrivateChatMessage>({
            messageId: message.id,
            allReplies: allMessagesReplies,
          })
            .map((reply) =>
              getBaseMessageToDisplay<WithId<PrivateChatMessage>>({
                message: reply,
                usersById: worldUsersById,
                myUserId: userId,
              })
            )
            .filter(isTruthy);

          return { ...displayMessage, replies: messageReplies };
        })
        .filter(isTruthy),
    [worldUsersById, userId, allMessagesReplies, messages]
  );

  return {
    sendMessageToSelectedRecipient,
    deleteMessage,
    markMessageRead,
    sendThreadReply,

    messagesToDisplay,
    recipient,
  };
};
