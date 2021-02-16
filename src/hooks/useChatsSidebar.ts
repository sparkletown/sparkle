import {
  chatVisibilitySelector,
  selectedChatSettingsSelector,
} from "utils/selectors";

import {
  setPrivateChatTabOpened,
  setVenueChatTabOpened,
  setChatSidebarVisibility,
} from "store/actions/Chat";

import { useSelector } from "./useSelector";
import { useDispatch } from "./useDispatch";
import { useNumberOfUnreadChats } from "./usePrivateChats";

export const useChatsSidebarControls = () => {
  const dispatch = useDispatch();

  const expandChat = () => {
    dispatch(setChatSidebarVisibility(true));
  };

  const closeChat = () => {
    dispatch(setChatSidebarVisibility(false));
  };

  const openVenueChat = () => {
    expandChat();
    dispatch(setVenueChatTabOpened());
  };

  const openPrivateChats = () => {
    expandChat();
    dispatch(setPrivateChatTabOpened());
  };

  const openPrivateRecipientChat = (recipientId: string) => {
    expandChat();
    dispatch(setPrivateChatTabOpened(recipientId));
  };

  const isChatSidebarVisible = useSelector(chatVisibilitySelector);

  const chatSettings = useSelector(selectedChatSettingsSelector);

  return {
    isChatSidebarVisible,
    chatSettings,

    expandChat,
    openVenueChat,
    openPrivateChats,
    openPrivateRecipientChat,
    closeChat,
  };
};

export const useChatsSidebarInfo = () => {
  const numberOfUnreadChats = useNumberOfUnreadChats();

  return {
    privateChatTabTitle: `Direct Messages ${
      numberOfUnreadChats ? `(${numberOfUnreadChats})` : ""
    }`,
    venueChatTabTitle: "Venue Chat",
  };
};
