import firebase from "firebase/app";

import { BaseChatMessage, ChatMessage, MessageToDisplay } from "types/chat";
import { User } from "types/User";

export const chatSort: (a: BaseChatMessage, b: BaseChatMessage) => number = (
  a: BaseChatMessage,
  b: BaseChatMessage
) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf());

export const getMessagesToDisplay = (
  message: ChatMessage,
  authorsById: Record<string, User>,
  myUserId?: string
): MessageToDisplay => ({
  text: message.text,
  author: { ...authorsById[message.from], id: message.from },
  timestamp: message.ts_utc.toMillis(),
  isMine: myUserId === message.from,
});

export const buildMessage = <T extends ChatMessage>(
  message: Pick<T, Exclude<keyof T, "ts_utc">>
) => ({
  ...message,
  ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
});
