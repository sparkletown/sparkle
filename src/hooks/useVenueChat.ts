import { useMemo, useCallback } from "react";
import { isEqual } from "lodash";

import { VENUE_CHAT_AGE_DAYS } from "settings";

import { sendVenueMessage, deleteVenueMessage } from "api/chat";

import {
  DeleteMessage,
  SendChatReply,
  SendMessage,
  VenueChatMessage,
} from "types/chat";

import {
  buildMessage,
  partitionMessagesFromReplies,
  getMessageReplies,
  getBaseMessageToDisplay,
} from "utils/chat";
import { venueChatMessagesSelector } from "utils/selectors";
import { isTruthy } from "utils/types";
import { WithId } from "utils/id";

import { useSelector } from "./useSelector";
import { useFirestoreConnect } from "./useFirestoreConnect";
import { useUser } from "./useUser";
import { useWorldUsersByIdWorkaround } from "./users";
import { useRoles } from "./useRoles";

const noMessages: WithId<VenueChatMessage>[] = [];

const useConnectVenueChatMessages = (venueId?: string) => {
  const startAt = (() => {
    const now = new Date();
    now.setDate(now.getDate() - VENUE_CHAT_AGE_DAYS);
    return now;
  })();

  useFirestoreConnect(
    venueId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "chats" }],
          where: ["ts_utc", ">", startAt],
          orderBy: ["ts_utc", "desc"],
          storeAs: "venueChatMessages",
        }
      : undefined
  );
};

export const useVenueChat = (venueId?: string) => {
  const { worldUsersById } = useWorldUsersByIdWorkaround();
  const { userRoles } = useRoles();
  const { userId } = useUser();

  useConnectVenueChatMessages(venueId);

  const chatMessages =
    useSelector(venueChatMessagesSelector, isEqual) ?? noMessages;

  const isAdmin = Boolean(userRoles?.includes("admin"));

  const filteredMessages = useMemo(
    () => chatMessages.filter((message) => message.deleted !== true),
    [chatMessages]
  );

  const sendMessage: SendMessage = useCallback(
    async ({ message, isQuestion }) => {
      if (!venueId || !userId) return;

      const processedMessage = buildMessage<VenueChatMessage>({
        from: userId,
        text: message,
        ...(isQuestion && { isQuestion }),
      });

      return sendVenueMessage({ venueId, message: processedMessage });
    },
    [venueId, userId]
  );

  const deleteMessage: DeleteMessage = useCallback(
    (messageId: string) => {
      if (!venueId) return;

      return deleteVenueMessage({ venueId, messageId });
    },
    [venueId]
  );

  const sendThreadReply: SendChatReply = useCallback(
    async ({ replyText, threadId }) => {
      if (!venueId || !userId) return;

      const threadReply = buildMessage<VenueChatMessage>({
        from: userId,
        text: replyText,
        threadId,
      });

      return sendVenueMessage({ venueId, message: threadReply });
    },
    [venueId, userId]
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
            WithId<VenueChatMessage>
          >({
            message,
            usersById: worldUsersById,
            myUserId: userId,

            isAdmin,
          });

          if (!displayMessage) return undefined;

          const messageReplies = getMessageReplies<VenueChatMessage>({
            messageId: message.id,
            allReplies: allMessagesReplies,
          })
            .map((reply) =>
              getBaseMessageToDisplay<WithId<VenueChatMessage>>({
                message: reply,
                usersById: worldUsersById,
                myUserId: userId,
                isAdmin,
              })
            )
            .filter(isTruthy);

          return { ...displayMessage, replies: messageReplies };
        })
        .filter(isTruthy),
    [userId, worldUsersById, isAdmin, messages, allMessagesReplies]
  );

  return {
    messagesToDisplay,

    sendMessage,
    deleteMessage,
    sendThreadReply,
  };
};
