import firebase from "firebase/app";

import {
  BaseChatMessage,
  ChatMessage,
  MessageToDisplay,
  PreviewChatMessageToDisplay,
  PreviewChatMessage,
} from "types/chat";
import { User } from "types/User";

export const chatSort: (a: BaseChatMessage, b: BaseChatMessage) => number = (
  a: BaseChatMessage,
  b: BaseChatMessage
) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf());

export const getMessageToDisplay = <T extends ChatMessage = ChatMessage>(
  message: T,
  usersById: Record<string, User>,
  // isAdmin: boolean,
  myUserId?: string
): MessageToDisplay<T> => {
  const isMine = myUserId === message.from;

  return {
    ...message,
    author: { ...usersById[message.from], id: message.from },
    canBeDeleted: false,
    isMine,
  };
};

export const getPreviewChatMessageToDisplay = (
  message: PreviewChatMessage,
  usersById: Record<string, User>,
  myUserId?: string
): PreviewChatMessageToDisplay => ({
  ...message,
  counterPartyUser: {
    ...usersById[message.counterPartyUserId],
    id: message.counterPartyUserId,
  },
  isMine: myUserId === message.from,
});

export const buildMessage = <T extends ChatMessage>(
  message: Pick<T, Exclude<keyof T, "ts_utc">>
) => ({
  ...message,
  ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
});
