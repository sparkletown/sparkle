import { ChatActions, ChatActionTypes } from "store/actions/Chat";
import { ChatTypes } from "types/chat";

type PrivateChatState = {
  openedChatType: ChatTypes.PRIVATE_CHAT;
  recipientId?: string;
};

type VenueChatState = {
  openedChatType: ChatTypes.VENUE_CHAT;
};

export type ChatState = {
  isChatSidebarVisible: boolean;
} & (PrivateChatState | VenueChatState);

const initialChatState: ChatState = {
  openedChatType: ChatTypes.VENUE_CHAT,
  isChatSidebarVisible: true,
};

export const chatReducer = (
  state = initialChatState,
  action: ChatActions
): ChatState => {
  switch (action.type) {
    case ChatActionTypes.SET_CHAT_SIDEBAR_VISIBILITY:
      return { ...state, isChatSidebarVisible: action.payload };
    case ChatActionTypes.SET_CHAT_TAB:
      return { ...state, openedChatType: action.payload.chatType };
    default:
      return state;
  }
};
