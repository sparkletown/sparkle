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
  partitionMessagesFromReplies,
  getMessageReplies,
  getBaseMessageToDisplay,
} from "utils/chat";
import { venueChatMessagesSelector } from "utils/selectors";
import { isTruthy } from "utils/types";
import { WithId } from "utils/id";

import { useSelector } from "../useSelector";
import { useFirestoreConnect } from "../useFirestoreConnect";
import { useUser } from "../useUser";
import { useWorldUsersByIdWorkaround } from "../users";
import { useRoles } from "../useRoles";
import { getDaysAgoInSeconds } from "../../utils/time";

export const useVenueChat = (venueId?: string, limit?: number) => {
  const { sendMessage, deleteMessage, sendThreadReply } = useChatMessageActions(
    venueId
  );
  const { hasMoreMessages, ...messages } = useChatMessages(venueId, limit);

  const transformedMessages = useTransformMessagesForDisplay(messages);

  return {
    messages: transformedMessages,
    hasMoreMessages,
    sendMessage,
    deleteMessage,
    sendThreadReply,
  };
};

const noMessages: WithId<VenueChatMessage>[] = [];

function useChatMessages(venueId?: string, limit?: number) {
  const maxLimitRef = useRef(0);

  if (limit && limit > maxLimitRef.current) maxLimitRef.current = limit;

  useFirestoreConnect(
    venueId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "chats" }],
          orderBy: ["ts_utc", "desc"],
          storeAs: "venueChatMessages",
          limit: maxLimitRef.current,
        }
      : undefined
  );

  const messages =
    useSelector(venueChatMessagesSelector, isEqual) ?? noMessages;

  const venueChatAgeThresholdSec = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);

  const filteredMessages = useMemo(
    () =>
      messages.filter(
        (message) =>
          message.deleted !== true &&
          message.ts_utc.seconds > venueChatAgeThresholdSec
      ),
    [messages, venueChatAgeThresholdSec]
  );

  const hasMoreMessages = maxLimitRef.current <= filteredMessages.length;

  return useMemo(
    () => ({
      ...partitionMessagesFromReplies(filteredMessages),
      hasMoreMessages,
    }),
    [filteredMessages, hasMoreMessages]
  );
}

function useTransformMessagesForDisplay({
  messages,
  allMessagesReplies,
}: Pick<
  ReturnType<typeof useChatMessages>,
  "messages" | "allMessagesReplies"
>) {
  const { worldUsersById } = useWorldUsersByIdWorkaround();
  const { userRoles } = useRoles();
  const { userId } = useUser();

  const isAdmin = Boolean(userRoles?.includes("admin"));

  return useMemo(
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
}

function useChatMessageActions(venueId?: string) {
  const { userId } = useUser();

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

  return {
    sendMessage,
    deleteMessage,
    sendThreadReply,
  };
}
