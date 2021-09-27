import { ChatTypes, PrivateChatSettings, VenueChatSettings } from "types/chat";
import { ReduxAction } from "types/redux";
import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

export enum ChatActionTypes {
  SET_CHAT_SIDEBAR_VISIBILITY = "SET_CHAT_SIDEBAR_VISIBILITY",
  SET_VENUE_CHAT_TAB_OPENED = "SET_VENUE_CHAT_TAB_OPENED",
  SET_PRIVATE_CHAT_TAB_OPENED = "SET_PRIVATE_CHAT_TAB_OPENED",
}

export type SetChatsSidebarVisibilityAction = ReduxAction<
  ChatActionTypes.SET_CHAT_SIDEBAR_VISIBILITY,
  { isVisible: boolean }
>;

export type SetVenueChatTabOpenedAction = ReduxAction<
  ChatActionTypes.SET_VENUE_CHAT_TAB_OPENED,
  VenueChatSettings
>;

export type SetPrivateChatTabOpenedAction = ReduxAction<
  ChatActionTypes.SET_PRIVATE_CHAT_TAB_OPENED,
  PrivateChatSettings
>;

export const setChatSidebarVisibility = (
  isVisible: boolean
): SetChatsSidebarVisibilityAction => ({
  type: ChatActionTypes.SET_CHAT_SIDEBAR_VISIBILITY,
  payload: { isVisible },
});

export const setVenueChatTabOpened = (): SetVenueChatTabOpenedAction => ({
  type: ChatActionTypes.SET_VENUE_CHAT_TAB_OPENED,
  payload: {
    openedChatType: ChatTypes.VENUE_CHAT,
  },
});

export const setPrivateChatTabOpened = (
  recipient: WithId<DisplayUser> | undefined
): SetPrivateChatTabOpenedAction => ({
  type: ChatActionTypes.SET_PRIVATE_CHAT_TAB_OPENED,
  payload: {
    openedChatType: ChatTypes.PRIVATE_CHAT,
    recipient,
  },
});

export type ChatActions =
  | SetChatsSidebarVisibilityAction
  | SetVenueChatTabOpenedAction
  | SetPrivateChatTabOpenedAction;
