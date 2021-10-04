import { useMemo } from "react";

import { ALWAYS_EMPTY_OBJECT, VENUE_CHAT_AGE_DAYS } from "settings";

import { getVenueRef } from "api/venue";

import {
  ChatMessage,
  InfiniteScrollProps,
  MessageToDisplay,
  VenueChatMessage,
} from "types/chat";

import { WithId } from "utils/id";
import { getDaysAgoInSeconds } from "utils/time";

import { useChatActions } from "hooks/chats/useChatActions";
import { useChatMessagesForDisplay } from "hooks/chats/useChatMessages";
import { useRenderInfiniteScroll } from "hooks/chats/util/useRenderInfiniteScroll";

export const useVenueChat = (venueId?: string) => {
  const chatActions = useVenueChatActions(venueId);
  const messagesToDisplay = useVenueChatMessages(venueId);

  return {
    ...chatActions,
    messagesToDisplay,
  };
};

const useVenueChatMessages = (
  venueId?: string
): [WithId<MessageToDisplay<VenueChatMessage>>[], InfiniteScrollProps] => {
  const venueChatAgeThresholdSec = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);

  const [messagesToDisplay] = useChatMessagesForDisplay<ChatMessage>(
    getVenueRef(venueId ?? "").collection("chats"),
    (message) => message.timestamp.seconds > venueChatAgeThresholdSec
  );

  const [toRender, props] = useRenderInfiniteScroll(messagesToDisplay);

  return [toRender, props];
};

const useVenueChatActions = (venueId?: string) => {
  const messagesRefs = useMemo(
    () => (venueId ? [getVenueRef(venueId).collection("chats")] : []),
    [venueId]
  );

  return useChatActions<VenueChatMessage>(messagesRefs, ALWAYS_EMPTY_OBJECT);
};
