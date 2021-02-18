import { createAsyncThunk } from "@reduxjs/toolkit";
import firebase from "firebase/app";
import { VenueChatSettings, PrivateChatSettings, ChatTypes } from "types/chat";
import { ReduxAction } from "types/redux";

export enum ChatActionTypes {
  SEND_GLOBAL_CHAT = "SEND_GLOBAL_CHAT",
  SEND_ROOM_CHAT = "SEND_ROOM_CHAT",
  SEND_PRIVATE_CHAT = "SEND_PRIVATE_CHAT",
  SEND_TABLE_CHAT = "SEND_TABLE_CHAT",
  SET_CHAT_SIDEBAR_VISIBILITY = "SET_CHAT_SIDEBAR_VISIBILITY",
  SET_VENUE_CHAT_TAB_OPENED = "SET_VENUE_CHAT_TAB_OPENED",
  SET_PRIVATE_CHAT_TAB_OPENED = "SET_PRIVATE_CHAT_TAB_OPENED",
}

interface BaseSendChatFields {
  venueId: string;
  text: string;
  from: string;
}
interface BaseSendChatToFields extends BaseSendChatFields {
  to: string;
}

interface SendGlobalChatFields extends BaseSendChatFields {}
interface SendPrivateChatFields extends Omit<BaseSendChatToFields, "venueId"> {}
interface SendRoomChatFields extends BaseSendChatToFields {}
interface SendTableChatFields extends BaseSendChatToFields {}

interface SendGlobalChatAction extends SendGlobalChatFields {
  type: ChatActionTypes.SEND_GLOBAL_CHAT;
}
interface SendPrivateChatAction extends SendPrivateChatFields {
  type: ChatActionTypes.SEND_PRIVATE_CHAT;
}
interface SendRoomChatAction extends SendRoomChatFields {
  type: ChatActionTypes.SEND_ROOM_CHAT;
}
interface SendTableChatAction extends SendTableChatFields {
  type: ChatActionTypes.SEND_TABLE_CHAT;
}

enum ChatMessageType {
  Global = "global",
  Room = "room",
  Private = "private",
  Table = "table",
}

type BuildMessageInput = {
  type: ChatMessageType.Global;
  text: string;
  from: string;
};

type BuildMessageToInput = {
  type: ChatMessageType.Private | ChatMessageType.Room | ChatMessageType.Table;
  text: string;
  from: string;
  to: string;
};

export type BaseChatMessage = {
  from: string;
  text: string;
  ts_utc: firebase.firestore.Timestamp;
  deleted?: boolean;
};

type NonGlobalChatMessage = BaseChatMessage & {
  to: string;
};

export type GlobalChatMessage = BaseChatMessage & {
  type: ChatMessageType.Global;
};

export type RestrictedChatMessage = NonGlobalChatMessage & {
  type: ChatMessageType.Table | ChatMessageType.Room;
};

export type PrivateChatMessage = NonGlobalChatMessage & {
  type: ChatMessageType.Private;
  isRead: boolean;
};

export type ChatMessage =
  | GlobalChatMessage
  | PrivateChatMessage
  | RestrictedChatMessage;

const collectionName = (venueId: string) => `venues/${venueId}/chats`;

const buildMessage = (
  data: BuildMessageInput | BuildMessageToInput
): ChatMessage => {
  const base: BaseChatMessage = {
    ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
    text: data.text,
    from: data.from,
  };

  switch (data.type) {
    case ChatMessageType.Global:
      return { ...base, type: data.type };
    case ChatMessageType.Room:
    case ChatMessageType.Table:
      return { ...base, type: data.type, to: data.to };
    case ChatMessageType.Private:
      return { ...base, type: data.type, to: data.to, isRead: false };
  }
};

const saveMessage = async (venueId: string, message: ChatMessage) =>
  await firebase
    .firestore()
    .collection(collectionName(venueId))
    .add(buildMessage(message));

export const sendGlobalChat = createAsyncThunk<void, SendGlobalChatFields>(
  ChatActionTypes.SEND_GLOBAL_CHAT,
  async ({ venueId, text, from }) => {
    await saveMessage(
      venueId,
      buildMessage({ type: ChatMessageType.Global, text, from })
    );
  }
);

export const sendPrivateChat = createAsyncThunk<void, SendPrivateChatFields>(
  ChatActionTypes.SEND_PRIVATE_CHAT,
  async ({ text, from, to }) => {
    for (const messageUser of [from, to]) {
      await firebase
        .firestore()
        .collection("privatechats")
        .doc(messageUser)
        .collection("chats")
        .add(buildMessage({ type: ChatMessageType.Private, text, from, to }));
    }
  }
);

export const sendRoomChat = createAsyncThunk<void, SendRoomChatFields>(
  ChatActionTypes.SEND_ROOM_CHAT,
  async ({ venueId, text, from, to }) => {
    await saveMessage(
      venueId,
      buildMessage({ type: ChatMessageType.Room, text, from, to })
    );
  }
);

export const sendTableChat = createAsyncThunk<void, SendTableChatFields>(
  ChatActionTypes.SEND_TABLE_CHAT,
  async ({ venueId, text, from, to }) => {
    await saveMessage(
      venueId,
      buildMessage({ type: ChatMessageType.Table, text, from, to })
    );
  }
);

type SetChatsSidebarVisibilityAction = ReduxAction<
  ChatActionTypes.SET_CHAT_SIDEBAR_VISIBILITY,
  { isVisible: boolean }
>;

type SetVenueChatTabOpenedAction = ReduxAction<
  ChatActionTypes.SET_VENUE_CHAT_TAB_OPENED,
  VenueChatSettings
>;

type SetPrivateChatTabOpenedAction = ReduxAction<
  ChatActionTypes.SET_PRIVATE_CHAT_TAB_OPENED,
  PrivateChatSettings
>;

export const setChatSidebarVisibility = (isVisible): SetChatsSidebarVisibilityAction => ({
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
  recipientId?: string
): SetPrivateChatTabOpenedAction => ({
  type: ChatActionTypes.SET_PRIVATE_CHAT_TAB_OPENED,
  payload: {
    openedChatType: ChatTypes.PRIVATE_CHAT,
    recipientId,
  },
});

export type ChatActions =
  | SendGlobalChatAction
  | SendPrivateChatAction
  | SendRoomChatAction
  | SendTableChatAction
  | SetChatsSidebarVisibilityAction
  | SetVenueChatTabOpenedAction
  | SetPrivateChatTabOpenedAction;
