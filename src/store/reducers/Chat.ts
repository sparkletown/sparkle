import { ChatActions, ChatActionTypes } from "store/actions/Chat";
import { CHAT_TYPES } from "types/Chat";

type PrivateChatState = {
  openedChatType: CHAT_TYPES.PRIVATE_CHAT;
  recipientId: string | null;
};

type VenueChatState = {
  openedChatType: CHAT_TYPES.VENUE_CHAT;
};

export type ChatState = {
  isChatSidebarVisible: boolean;
} & (PrivateChatState | VenueChatState);

const initialChatState: ChatState = {
  openedChatType: CHAT_TYPES.VENUE_CHAT,
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
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
