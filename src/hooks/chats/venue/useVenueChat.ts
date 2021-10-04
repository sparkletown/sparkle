import { useMemo } from "react";

import { ALWAYS_EMPTY_OBJECT, VENUE_CHAT_AGE_DAYS } from "settings";

import { getVenueRef } from "api/venue";

import { ChatMessage, VenueChatMessage } from "types/chat";

import { getDaysAgoInSeconds } from "utils/time";

import { useChatActions } from "hooks/chats/useChatActions";
import { useChatMessagesForDisplay } from "hooks/chats/useChatMessages";

export const useVenueChat = (venueId?: string) => {
  const chatActions = useVenueChatActions(venueId);

  const venueChatAgeThresholdSec = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);
  const [messagesToDisplay] = useChatMessagesForDisplay<ChatMessage>(
    getVenueRef(venueId ?? "").collection("chats"),
    (message) => message.timestamp.seconds > venueChatAgeThresholdSec
  );

  return {
    ...chatActions,
    messagesToDisplay,
  };
};

const useVenueChatActions = (venueId?: string) => {
  const messagesRefs = useMemo(
    () => (venueId ? [getVenueRef(venueId).collection("chats")] : []),
    [venueId]
  );

  return useChatActions<VenueChatMessage>(messagesRefs, ALWAYS_EMPTY_OBJECT);
};
