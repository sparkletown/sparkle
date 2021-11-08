import { useMemo } from "react";

import { DEFAULT_CHAT_TITLE } from "settings/worldDefaultSettings";

import { AnyVenue } from "types/venues";

import { usePrivateChatPreviews } from "hooks/chats/private/usePrivateChatPreviews";
import { useCurrentWorld } from "hooks/useCurrentWorld";
import { useUser } from "hooks/useUser";

export const useChatSidebarInfo = (venue: AnyVenue) => {
  const numberOfUnreadChats = useNumberOfUnreadChats();
  const { world } = useCurrentWorld({ worldId: venue.worldId });
  const chatTitle = world?.chatTitle ?? DEFAULT_CHAT_TITLE;

  return {
    privateChatTabTitle: `Direct Messages ${
      numberOfUnreadChats ? `(${numberOfUnreadChats})` : ""
    }`,
    venueChatTabTitle: `${chatTitle} Chat`,
  };
};

export const useNumberOfUnreadChats = () => {
  const { userId } = useUser();
  const { privateChatPreviews } = usePrivateChatPreviews();

  return useMemo(
    () =>
      privateChatPreviews.filter(
        (chatPreview) =>
          !chatPreview.isRead && chatPreview.fromUser.id !== userId
      ).length,
    [privateChatPreviews, userId]
  );
};
