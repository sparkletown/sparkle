import { useMemo } from "react";

import { VENUE_CHAT_AGE_DAYS } from "settings";

import { sendVenueMessage } from "api/chat";

import { buildMessage } from "utils/chat";
import { venueChatsSelector } from "utils/selectors";
import { chatSort } from "utils/chat";
import { getDaysAgoInSeconds } from "utils/time";

import { ChatMessage, MessageToDisplay } from "types/chat";
import { User } from "types/User";

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

const getMessagesToDisplay = (
  message: ChatMessage,
  authorsById: Record<string, User>,
  myUserId?: string
): MessageToDisplay => ({
  text: message.text,
  author: { ...authorsById[message.from], id: message.from },
  timestamp: message.ts_utc.toMillis(),
  isMine: myUserId === message.from,
});

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

  const sendMessage = (text: string) => {
    if (!venueId || !user?.uid) return;

    const message = buildMessage({ from: user?.uid, text });

    sendVenueMessage({ venueId, message });
  };

  const deleteMessage = () => {};

  return useMemo(
    () => ({
      venueChatMessages: filteredMessages,
      messagesToDisplay: filteredMessages.map((message) =>
        getMessagesToDisplay(message, worldUsersById, userId)
      ),
      sendMessage,
      deleteMessage,
    }),
    [filteredMessages]
  );
};
