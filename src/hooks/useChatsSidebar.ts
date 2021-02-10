import { ChatTypes, SetAnyChatTabOptions } from "types/chat";

import { chatUIStateSelector } from "utils/selectors";

import { setChatTab, setChatSidebarVisibility } from "store/actions/Chat";

import { useSelector } from "./useSelector";
import { useDispatch } from "./useDispatch";

export const useChatsSidebarControls = () => {
  const dispatch = useDispatch();

  const openChat = (
    chatOptions: SetAnyChatTabOptions = { chatType: ChatTypes.VENUE_CHAT }
  ) => {
    dispatch(setChatSidebarVisibility(true));
    dispatch(setChatTab(chatOptions));
  };

  const closeChat = () => {
    dispatch(setChatSidebarVisibility(false));
  };

  const { isChatSidebarVisible, openedChatType } = useSelector(
    chatUIStateSelector
  );

  return {
    isChatSidebarVisible,
    openedChatType,

    openChat,
    closeChat,
  };
};

export const useChatsSidebarInfo = () => {
  return {
    worldChatTabTitle: "World chat",
    privateChatTabTitle: "Private Chats",
    venueChatTabTitle: "Venue Chat",
  };
};
