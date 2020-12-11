import { createAsyncThunk } from "@reduxjs/toolkit";
import firebase from "firebase/app";

export const SEND_GLOBAL_CHAT: string = "SEND_GLOBAL_CHAT";
export const SEND_ROOM_CHAT: string = "SEND_ROOM_CHAT";
export const SEND_PRIVATE_CHAT: string = "SEND_PRIVATE_CHAT";
export const SEND_TABLE_CHAT: string = "SEND_TABLE_CHAT";

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
  type: typeof SEND_GLOBAL_CHAT;
}
interface SendPrivateChatAction extends SendPrivateChatFields {
  type: typeof SEND_PRIVATE_CHAT;
}
interface SendRoomChatAction extends SendRoomChatFields {
  type: typeof SEND_ROOM_CHAT;
}
interface SendTableChatAction extends SendTableChatFields {
  type: typeof SEND_TABLE_CHAT;
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
  SEND_GLOBAL_CHAT,
  async ({ venueId, text, from }) => {
    await saveMessage(
      venueId,
      buildMessage({ type: ChatMessageType.Global, text, from })
    );
  }
);

export const sendPrivateChat = createAsyncThunk<void, SendPrivateChatFields>(
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

export const sendRoomChat = createAsyncThunk<void, SendRoomChatFields>(
  SEND_ROOM_CHAT,
  async ({ venueId, text, from, to }) => {
    await saveMessage(
      venueId,
      buildMessage({ type: ChatMessageType.Room, text, from, to })
    );
  }
);

export const sendTableChat = createAsyncThunk<void, SendTableChatFields>(
  SEND_TABLE_CHAT,
  async ({ venueId, text, from, to }) => {
    await saveMessage(
      venueId,
      buildMessage({ type: ChatMessageType.Table, text, from, to })
    );
  }
);

export type ChatActions =
  | SendGlobalChatAction
  | SendPrivateChatAction
  | SendRoomChatAction
  | SendTableChatAction;
