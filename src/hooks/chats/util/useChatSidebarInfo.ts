import { useMemo } from "react";

import { usePrivateChatPreviews } from "hooks/chats/private/usePrivateChatPreviews";
import { useUserId } from "hooks/user/useUserId";

export const useChatSidebarInfo = () => {
  const numberOfUnreadChats = useNumberOfUnreadChats();

  return {
    privateChatTabTitle: `Direct Messages ${
      numberOfUnreadChats ? `(${numberOfUnreadChats})` : ""
    }`,
  };
};

export const useNumberOfUnreadChats = () => {
  const { userId } = useUserId();
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
