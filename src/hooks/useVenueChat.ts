import { useMemo, useCallback } from "react";

import { VENUE_CHAT_AGE_DAYS } from "settings";

import { sendVenueMessage, deleteVenueMessage } from "api/chat";

import { VenueChatMessage } from "types/chat";

import { buildMessage, chatSort, getMessageToDisplay } from "utils/chat";
import { venueChatMessagesSelector } from "utils/selectors";
import { getDaysAgoInSeconds } from "utils/time";

import { useSelector } from "./useSelector";
import { useFirestoreConnect } from "./useFirestoreConnect";
import { useVenueId } from "./useVenueId";
import { useUser } from "./useUser";
import { useWorldUsersById } from "./users";
import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";

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
  const { worldUsersById } = useWorldUsersById();
  const { currentVenue } = useConnectCurrentVenueNG();
  const { user } = useUser();

  const userId = user?.uid;

  useConnectVenueChatMessages(venueId);

  const chatMessages = useSelector(venueChatMessagesSelector) ?? [];

  const isAdmin = Boolean(userId && currentVenue?.owners?.includes(userId));

  const venueChatAgeThresholdSec = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);

  const filteredMessages = chatMessages
    .filter(
      (message) =>
        message.deleted !== true &&
        message.ts_utc.seconds > venueChatAgeThresholdSec
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
      messagesToDisplay: filteredMessages.map((message) =>
        getMessageToDisplay({
          message,
          usersById: worldUsersById,
          myUserId: userId,
          isAdmin,
        })
      ),
      sendMessage,
      deleteMessage,
    }),
    [
      filteredMessages,
      sendMessage,
      deleteMessage,
      worldUsersById,
      userId,
      isAdmin,
    ]
  );
};
