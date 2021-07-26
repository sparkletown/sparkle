import { useMemo, useCallback, useRef } from "react";
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
  chatSort,
  partitionMessagesFromReplies,
  getMessageReplies,
  getBaseMessageToDisplay,
} from "utils/chat";
import { venueChatMessagesSelector } from "utils/selectors";
import { getDaysAgoInSeconds } from "utils/time";
import { isTruthy } from "utils/types";
import { WithId } from "utils/id";

import { useSelector } from "../useSelector";
import { useFirestoreConnect } from "../useFirestoreConnect";
import { useUser } from "../useUser";
import { useWorldUsersByIdWorkaround } from "../users";
import { useRoles } from "../useRoles";

const noMessages: WithId<VenueChatMessage>[] = [];

export const useConnectVenueChatMessages = (
  venueId?: string,
  limit?: number
) => {
  useFirestoreConnect(
    venueId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "chats" }],
          orderBy: ["ts_utc", "desc"],
          storeAs: "venueChatMessages",
          limit,
        }
      : undefined
  );
};

export const useVenueChat = (venueId?: string, limit?: number) => {
  const { worldUsersById } = useWorldUsersByIdWorkaround();
  const { userRoles } = useRoles();
  const { userId } = useUser();

  const maxLimitRef = useRef(0);

  if (limit && limit > maxLimitRef.current) maxLimitRef.current = limit;

  useConnectVenueChatMessages(venueId, maxLimitRef.current);

  const chatMessages =
    useSelector(venueChatMessagesSelector, isEqual) ?? noMessages;

  const isAdmin = Boolean(userRoles?.includes("admin"));

  const venueChatAgeThresholdSec = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);

  const filteredMessages = useMemo(
    () =>
      chatMessages
        .filter(
          (message) =>
            message.deleted !== true &&
            message.ts_utc.seconds > venueChatAgeThresholdSec
        )
        .sort(chatSort),
    [chatMessages, venueChatAgeThresholdSec]
  );

  const hasMoreMessages = maxLimitRef.current <= filteredMessages.length;

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
    messages: messagesToDisplay,
    hasMoreMessages,

    sendMessage,
    deleteMessage,
    sendThreadReply,
  };
};
