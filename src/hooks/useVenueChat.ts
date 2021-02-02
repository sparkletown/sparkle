import { useMemo } from "react";

import { venueChatsSelector } from "utils/selectors";
import { chatSort } from "utils/chat";
import { getDaysAgoInSeconds, roundToNearestHour } from "utils/time";

import { VENUE_CHAT_AGE_DAYS } from "settings";

import { useSelector } from "./useSelector";
import { useFirestoreConnect } from "./useFirestoreConnect";
import { useVenueId } from "./useVenueId";

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
  useConnectVenueChat(venueId);

  const chats = useSelector(venueChatsSelector) ?? [];

  const DAYS_AGO = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);
  const HIDE_BEFORE = roundToNearestHour(DAYS_AGO);

  return useMemo(
    () => ({
      venueChatMessages: chats
        .filter(
          (message) =>
            message.deleted !== true &&
            message.type === "room" &&
            message.to === venueId &&
            message.ts_utc.seconds > HIDE_BEFORE
        )
        .sort(chatSort),
    }),
    [chats, venueId, HIDE_BEFORE]
  );
};
