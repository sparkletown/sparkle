import { useMemo, useCallback } from "react";

import { VENUE_CHAT_AGE_DAYS } from "settings";

import { sendVenueMessage, deleteVenueMessage } from "api/chat";

import { VenueChatMessage } from "types/chat";

import { buildMessage, getMessageToDisplay } from "utils/chat";
import { venueChatsSelector } from "utils/selectors";
import { chatSort } from "utils/chat";
import { getDaysAgoInSeconds } from "utils/time";

import { useSelector } from "./useSelector";
import { useFirestoreConnect } from "./useFirestoreConnect";
import { useVenueId } from "./useVenueId";
import { useUser } from "./useUser";
import { useWorldUsersById } from "./users";

export const useConnectVenueChat = (venueId?: string) => {
  useFirestoreConnect(
    venueId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "chats" }],
          storeAs: "venueChats",
        }
      : undefined
  );
};

export const useVenueChat = () => {
  const venueId = useVenueId();
  const { worldUsersById } = useWorldUsersById();
  const { user } = useUser();

  const userId = user?.uid;

  useConnectVenueChat(venueId);

  const chats = useSelector(venueChatsSelector) ?? [];

  const DAYS_AGO_IN_SECONDS = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);

  const filteredMessages = chats
    .filter(
      (message) =>
        message.deleted !== true && message.ts_utc.seconds > DAYS_AGO_IN_SECONDS
    )
    .sort(chatSort);

  const sendMessage = useCallback(
    (text: string) => {
      if (!venueId || !userId) return;

      const message = buildMessage<VenueChatMessage>({ from: userId, text });

      sendVenueMessage({ venueId, message });
    },
    [venueId, userId]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!venueId) return;

      deleteVenueMessage({ venueId, messageId });
    },
    [venueId]
  );

  return useMemo(
    () => ({
      venueChatMessages: filteredMessages,
      messagesToDisplay: filteredMessages.map((message) =>
        getMessageToDisplay(message, worldUsersById, userId)
      ),
      sendMessage,
      deleteMessage,
    }),
    [filteredMessages, sendMessage, deleteMessage, worldUsersById, userId]
  );
};
