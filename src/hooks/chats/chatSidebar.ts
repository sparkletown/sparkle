import { useCallback, useMemo } from "react";

import {
  setChatSidebarVisibility,
  setPrivateChatTabOpened,
  setVenueChatTabOpened,
} from "store/actions/Chat";

import { AnyVenue } from "types/venues";

import {
  chatVisibilitySelector,
  selectedChatSettingsSelector,
} from "utils/selectors";

import { useDispatch } from "hooks/useDispatch";
import { useRecentWorldUsers } from "hooks/users";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import { usePrivateChatPreviews } from "./privateChats/usePrivateChatPreviews";

export const useChatSidebarControls = () => {
  const dispatch = useDispatch();
  const { numberOnlineUsers } = useRecentWorldUsers();
  const isExpanded = useSelector(chatVisibilitySelector);
  const chatSettings = useSelector(selectedChatSettingsSelector);

  const expandSidebar = useCallback(() => {
    dispatch(setChatSidebarVisibility(true));
  }, [dispatch]);

  const collapseSidebar = useCallback(() => {
    dispatch(setChatSidebarVisibility(false));
  }, [dispatch]);

  const toggleSidebar = useCallback(() => {
    if (isExpanded) {
      collapseSidebar();
    } else {
      expandSidebar();
    }
  }, [expandSidebar, collapseSidebar, isExpanded]);

  const selectVenueChat = useCallback(() => {
    expandSidebar();
    dispatch(setVenueChatTabOpened());
  }, [dispatch, expandSidebar]);

  const selectPrivateChat = useCallback(() => {
    expandSidebar();
    dispatch(setPrivateChatTabOpened());
  }, [dispatch, expandSidebar]);

  const selectRecipientChat = useCallback(
    (recipientId: string) => {
      expandSidebar();
      dispatch(setPrivateChatTabOpened(recipientId));
    },
    [dispatch, expandSidebar]
  );

  return {
    isExpanded,
    chatSettings,
    numberOnlineUsers,

    expandSidebar,
    selectVenueChat,
    selectPrivateChat,
    selectRecipientChat,
    collapseSidebar,
    toggleSidebar,
  };
};

export const useChatSidebarInfo = (venue: AnyVenue) => {
  const numberOfUnreadChats = useNumberOfUnreadChats();
  const chatTitle = venue?.chatTitle ?? "Venue";

  return {
    privateChatTabTitle: `Direct Messages ${
      numberOfUnreadChats ? `(${numberOfUnreadChats})` : ""
    }`,
    venueChatTabTitle: `${chatTitle} Chat`,
  };
};

const useNumberOfUnreadChats = () => {
  const { user } = useUser();
  const { privateChatPreviews } = usePrivateChatPreviews();

  const userId = user?.uid;

  return useMemo(
    () =>
      privateChatPreviews.filter(
        (chatPreview) => !chatPreview.isRead && chatPreview.from !== userId
      ).length,
    [privateChatPreviews, userId]
  );
};
