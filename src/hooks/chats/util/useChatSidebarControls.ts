import { useCallback } from "react";

import {
  setChatSidebarVisibility,
  setPrivateChatTabOpened,
  setVenueChatTabOpened,
} from "store/actions/Chat";

import { DisplayUser } from "types/User";

import { WithId } from "utils/id";
import {
  chatVisibilitySelector,
  selectedChatSettingsSelector,
} from "utils/selectors";

import { useDispatch } from "hooks/useDispatch";
import { useSelector } from "hooks/useSelector";

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
      dispatch(setVenueChatTabOpened());
      expandSidebar();
    }
  }, [expandSidebar, collapseSidebar, dispatch, isExpanded]);

  const togglePrivateChatSidebar = useCallback(() => {
    if (isExpanded) {
      collapseSidebar();
    } else {
      expandSidebar();
      dispatch(setPrivateChatTabOpened());
    }
  }, [expandSidebar, collapseSidebar, dispatch, isExpanded]);

  const selectVenueChat = useCallback(() => {
    expandSidebar();
    dispatch(setVenueChatTabOpened());
  }, [dispatch, expandSidebar]);

  const selectPrivateChat = useCallback(() => {
    expandSidebar();
    dispatch(setPrivateChatTabOpened());
  }, [dispatch, expandSidebar]);

  const selectRecipientChat = useCallback(
    (recipient: WithId<DisplayUser>) => {
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
    togglePrivateChatSidebar,
  };
};
