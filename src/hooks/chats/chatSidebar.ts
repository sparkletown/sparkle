import { useCallback, useMemo } from "react";

import {
  setChatSidebarVisibility,
  setPrivateChatTabOpened,
  setVenueChatTabOpened,
} from "store/actions/Chat";

import { ChatUser } from "types/chat";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import {
  chatVisibilitySelector,
  selectedChatSettingsSelector,
} from "utils/selectors";

import { useDispatch } from "hooks/useDispatch";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import { usePrivateChatPreviews } from "./privateChats/usePrivateChatPreviews";

export const useChatSidebarControls = () => {
  const dispatch = useDispatch();
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
    dispatch(setPrivateChatTabOpened(undefined));
  }, [dispatch, expandSidebar]);

  const selectRecipientChat = useCallback(
    (recipient: WithId<ChatUser>) => {
      expandSidebar();
      dispatch(setPrivateChatTabOpened(recipient));
    },
    [dispatch, expandSidebar]
  );

  return {
    isExpanded,
    chatSettings,

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
