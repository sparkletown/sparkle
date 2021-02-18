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
import { useNumberOfUnreadChats } from "./privateChats";

export const useChatSidebarControls = () => {
  const dispatch = useDispatch();

  const expandSidebar = () => {
    dispatch(setChatSidebarVisibility(true));
  };

  const collapseSidebar = () => {
    dispatch(setChatSidebarVisibility(false));
  };

  const selectVenueChat = () => {
    expandSidebar();
    dispatch(setVenueChatTabOpened());
  };

  const selectPrivateChat = () => {
    expandSidebar();
    dispatch(setPrivateChatTabOpened());
  };

  const selectRecipientChat = (recipientId: string) => {
    expandSidebar();
    dispatch(setPrivateChatTabOpened(recipientId));
  };

  const isExpanded = useSelector(chatVisibilitySelector);

  const chatSettings = useSelector(selectedChatSettingsSelector);

  return {
    isExpanded,
    chatSettings,

    expandSidebar,
    selectVenueChat,
    selectPrivateChat,
    selectRecipientChat,
    collapseSidebar,
  };
};

export const useChatSidebarInfo = () => {
  const numberOfUnreadChats = useNumberOfUnreadChats();

  return {
    privateChatTabTitle: `Direct Messages ${
      numberOfUnreadChats ? `(${numberOfUnreadChats})` : ""
    }`,
    venueChatTabTitle: "Venue Chat",
  };
};
