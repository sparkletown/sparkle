import { createAsyncThunk } from "@reduxjs/toolkit";
import firebase from "firebase/app";

export const SEND_GLOBAL_CHAT: string = "SEND_GLOBAL_CHAT";
export const SEND_ROOM_CHAT: string = "SEND_ROOM_CHAT";
export const SEND_PRIVATE_CHAT: string = "SEND_PRIVATE_CHAT";
export const SEND_TABLE_CHAT: string = "SEND_TABLE_CHAT";

interface BaseSendChatAction {
  venueId: string;
  text: string;
  from: string;
}

interface BaseSendChatToAction extends BaseSendChatAction {
  to: string;
}

interface SendGlobalChatAction extends BaseSendChatAction {
  type: typeof SEND_GLOBAL_CHAT;
}

interface SendRoomChatAction extends BaseSendChatToAction {
  type: typeof SEND_ROOM_CHAT;
}

interface SendTableChatAction extends BaseSendChatToAction {
  type: typeof SEND_TABLE_CHAT;
}

interface SendPrivateChatAction extends Omit<BaseSendChatToAction, "venueId"> {
  type: typeof SEND_PRIVATE_CHAT;
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
  type: ChatMessageType.Room | ChatMessageType.Table | ChatMessageType.Private;
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
  | RestrictedChatMessage
  | PrivateChatMessage;

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

export const sendGlobalChat = createAsyncThunk<void, SendGlobalChatAction>(
  SEND_GLOBAL_CHAT,
  async ({ venueId, text, from }) => {
    await firebase
      .firestore()
      .collection(collectionName(venueId))
      .add(buildMessage({ type: ChatMessageType.Global, text, from }));
  }
);

export const sendRoomChat = createAsyncThunk<void, SendRoomChatAction>(
  SEND_ROOM_CHAT,
  async ({ venueId, text, from, to }) => {
    await firebase
      .firestore()
      .collection(collectionName(venueId))
      .add(buildMessage({ type: ChatMessageType.Room, text, from, to }));
  }
);

export const sendTableChat = createAsyncThunk<void, SendTableChatAction>(
  SEND_TABLE_CHAT,
  async ({ venueId, text, from, to }) => {
    await firebase
      .firestore()
      .collection(collectionName(venueId))
      .add(buildMessage({ type: ChatMessageType.Table, text, from, to }));
  }
);

export const sendPrivateChat = createAsyncThunk<void, SendPrivateChatAction>(
  SEND_PRIVATE_CHAT,
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

export type ChatActions =
  | SendGlobalChatAction
  | SendRoomChatAction
  | SendTableChatAction
  | SendPrivateChatAction;
