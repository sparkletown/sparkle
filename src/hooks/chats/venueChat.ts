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
  filterNewSchemaMessages,
  getMessageReplies,
  partitionMessagesFromReplies,
} from "utils/chat";
import { WithId } from "utils/id";
import { venueChatMessagesSelector } from "utils/selectors";
import { getDaysAgoInSeconds } from "utils/time";
import { isTruthy } from "utils/types";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
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
  const { userWithId } = useUser();

  const sendMessage: SendMessage = useCallback(
    async ({ message, isQuestion }) => {
      if (!venueId || !userWithId) return;

      const processedMessage = buildMessage<VenueChatMessage>(userWithId, {
        text: message,
        ...(isQuestion && { isQuestion }),
      });

      return sendVenueMessage({ venueId, message: processedMessage });
    },
    [venueId, userWithId]
  );

  const deleteMessage: DeleteMessage = useCallback(
    async (messageId: string) => {
      if (!venueId) return;

      return deleteVenueMessage({ venueId, messageId });
    },
    [venueId]
  );

  const sendThreadReply: SendChatReply = useCallback(
    async ({ replyText, threadId }) => {
      if (!venueId || !userWithId) return;

      const threadReply = buildMessage<VenueChatMessage>(userWithId, {
        text: replyText,
        threadId,
      });

      return sendVenueMessage({ venueId, message: threadReply });
    },
    [venueId, userWithId]
  );

  return {
    sendMessage,
    deleteMessage,
    sendThreadReply,
  };
};

const useChatMessages = (venueId?: string) => {
  useConnectVenueChatMessages(venueId);

  const chatMessages =
    filterNewSchemaMessages<VenueChatMessage>(
      useSelector(venueChatMessagesSelector, isEqual)
    ) ?? noMessages;

  const venueChatAgeThresholdSec = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);

  const filteredMessages = useMemo(
    () =>
      chatMessages.filter(
        (message) =>
          message.deleted !== true &&
          message.timestamp.seconds > venueChatAgeThresholdSec
      ),
    [chatMessages, venueChatAgeThresholdSec]
  );

  const { messages, allMessagesReplies } = useMemo(
    () => partitionMessagesFromReplies<VenueChatMessage>(filteredMessages),
    [filteredMessages]
  );

  return useMemo(
    () =>
      messages
        .map((message) => {
          const messageReplies = getMessageReplies<VenueChatMessage>({
            messageId: message.id,
            allReplies: allMessagesReplies,
          }).filter(isTruthy);

          return {
            ...message,
            replies: messageReplies,
          };
        })
        .filter(isTruthy),
    [messages, allMessagesReplies]
  );
};

const useConnectVenueChatMessages = (venueId?: string) => {
  useFirestoreConnect(
    venueId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "chats" }],
          orderBy: ["timestamp", "desc"],
          storeAs: "venueChatMessages",
        }
      : undefined
  );
};
