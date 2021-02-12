import { ChatActions, ChatActionTypes } from "store/actions/Chat";
import { ChatTypes, ChatSettings } from "types/chat";

export type ChatState = {
  isChatSidebarVisible: boolean;
  settings: ChatSettings;
};

const initialChatState: ChatState = {
  isChatSidebarVisible: true,
  settings: {
    openedChatType: ChatTypes.VENUE_CHAT,
  },
};

export const chatReducer = (
  state = initialChatState,
  action: ChatActions
): ChatState => {
  switch (action.type) {
    case ChatActionTypes.SET_CHAT_SIDEBAR_VISIBILITY:
      return { ...state, isChatSidebarVisible: action.payload.isVisible };
    case ChatActionTypes.SET_VENUE_CHAT_TAB_OPENED:
      return {
        ...state,
        settings: { openedChatType: action.payload.openedChatType },
      };
    case ChatActionTypes.SET_PRIVATE_CHAT_TAB_OPENED:
      return {
        ...state,
        settings: {
          openedChatType: action.payload.openedChatType,
          recipientId: action.payload.recipientId,
        },
      };
    default:
      return state;
  }
};
