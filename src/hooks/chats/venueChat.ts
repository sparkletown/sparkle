import { useCallback, useMemo } from "react";
import { isEqual } from "lodash";

import { VENUE_CHAT_AGE_DAYS } from "settings";

import { deleteVenueMessage, sendVenueMessage } from "api/chat";

import {
  DeleteMessage,
  SendChatReply,
  SendMessage,
  VenueChatMessage,
} from "types/chat";

import {
  buildMessage,
  getBaseMessageToDisplay,
  getMessageReplies,
  partitionMessagesFromReplies,
} from "utils/chat";
import { WithId } from "utils/id";
import { venueChatMessagesSelector } from "utils/selectors";
import { getDaysAgoInSeconds } from "utils/time";
import { isTruthy } from "utils/types";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useRoles } from "hooks/useRoles";
import { useWorldUsersByIdWorkaround } from "hooks/users";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

const noMessages: WithId<VenueChatMessage>[] = [];

export const useVenueChat = (venueId?: string) => {
  const messagesToDisplay = useChatMessages(venueId);

  const { sendMessage, deleteMessage, sendThreadReply } = useChatActions(
    venueId
  );

  return {
    messagesToDisplay,

    sendMessage,
    deleteMessage,
    sendThreadReply,
  };
};

const useChatActions = (venueId?: string) => {
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
};

const useChatMessages = (venueId?: string) => {
  const { worldUsersById } = useWorldUsersByIdWorkaround();
  const { userRoles } = useRoles();
  const isAdmin = Boolean(userRoles?.includes("admin"));
  const { userId } = useUser();

  useConnectVenueChatMessages(venueId);

  const chatMessages =
    useSelector(venueChatMessagesSelector, isEqual) ?? noMessages;

  const venueChatAgeThresholdSec = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);

  const filteredMessages = useMemo(
    () =>
      chatMessages.filter(
        (message) =>
          message.deleted !== true &&
          message.ts_utc.seconds > venueChatAgeThresholdSec
      ),
    [chatMessages, venueChatAgeThresholdSec]
  );

  const { messages, allMessagesReplies } = useMemo(
    () => partitionMessagesFromReplies(filteredMessages),
    [filteredMessages]
  );

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
};

const useConnectVenueChatMessages = (venueId?: string) => {
  useFirestoreConnect(
    venueId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "chats" }],
          orderBy: ["ts_utc", "desc"],
          storeAs: "venueChatMessages",
        }
      : undefined
  );
};
