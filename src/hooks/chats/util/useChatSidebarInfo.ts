import { useMemo } from "react";

import { AnyVenue } from "types/venues";

import { usePrivateChatPreviews } from "hooks/chats/private/usePrivateChatPreviews";
import { useUser } from "hooks/useUser";

export const useChatSidebarInfo = (venue: AnyVenue) => {
  const numberOfUnreadChats = useNumberOfUnreadChats();

  return {
    privateChatTabTitle: `Direct Messages ${
      numberOfUnreadChats ? `(${numberOfUnreadChats})` : ""
    }`,
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
