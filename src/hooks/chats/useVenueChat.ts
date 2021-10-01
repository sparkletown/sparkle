import { useCallback } from "react";
import { useFirestore } from "reactfire";

import { VENUE_CHAT_AGE_DAYS } from "settings";

import { deleteVenueMessage, sendVenueMessage } from "api/chat";

import {
  ChatMessage,
  DeleteMessage,
  SendChatReply,
  SendMessage,
  VenueChatMessage,
} from "types/chat";

import { buildMessage } from "utils/chat";
import { getDaysAgoInSeconds } from "utils/time";

import { useChatMessages } from "hooks/chats/useChatMessages";
import { useUser } from "hooks/useUser";

export const useVenueChat = (venueId?: string) => {
  const chatActions = useVenueChatActions(venueId);

  const firestore = useFirestore();

  const venueChatAgeThresholdSec = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);
  const [messagesToDisplay] = useChatMessages<ChatMessage>(
    firestore
      .collection("venues")
      .doc(venueId)
      .collection("chats")
      .orderBy("timestamp", "desc"),
    (message) => message.timestamp.seconds > venueChatAgeThresholdSec
  );

  return {
    ...chatActions,
    messagesToDisplay,
  };
};

const useVenueChatActions = (venueId?: string) => {
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
