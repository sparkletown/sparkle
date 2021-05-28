import { useMemo, useCallback } from "react";

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

import { useSelector } from "./useSelector";
import { useFirestoreConnect } from "./useFirestoreConnect";
import { useVenueId } from "./useVenueId";
import { useUser } from "./useUser";
import { useWorldUsersByIdWorkaround } from "./users";
import { useRoles } from "./useRoles";

export const useConnectVenueChatMessages = (venueId?: string) => {
  useFirestoreConnect(
    venueId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "chats" }],
          storeAs: "venueChatMessages",
        }
      : undefined
  );
};

export const useVenueChat = () => {
  const venueId = useVenueId();
  const { worldUsersById } = useWorldUsersByIdWorkaround();
  const { userRoles } = useRoles();
  const { user } = useUser();

  const userId = user?.uid;

  useConnectVenueChatMessages(venueId);

  const chatMessages = useSelector(venueChatMessagesSelector) ?? [];

  const isAdmin = Boolean(userRoles?.includes("admin"));

  const venueChatAgeThresholdSec = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);

  const filteredMessages = chatMessages
    .filter(
      (message) =>
        message.deleted !== true &&
        message.ts_utc.seconds > venueChatAgeThresholdSec
    )
    .sort(chatSort);

  const sendMessage: SendMessage = useCallback(
    async ({ message, isQuestion }) => {
      if (!venueId || !userId) return;

      const processedMessage = buildMessage<VenueChatMessage>({
        from: userId,
        message,
        isQuestion,
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
        message: replyText,
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

  return useMemo(
    () => ({
      messagesToDisplay,

      sendMessage,
      deleteMessage,
      sendThreadReply,
    }),
    [messagesToDisplay, sendMessage, sendThreadReply, deleteMessage]
  );
};
