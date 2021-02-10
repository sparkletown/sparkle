import firebase from "firebase/app";

import { BaseChatMessage, ChatMessage } from "types/chat";

export const chatSort: (a: BaseChatMessage, b: BaseChatMessage) => number = (
  a: BaseChatMessage,
  b: BaseChatMessage
) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf());

export const buildMessage = (
  message: Pick<ChatMessage, Exclude<keyof ChatMessage, "ts_utc">>
): ChatMessage => {
  const ts_utc = firebase.firestore.Timestamp.fromDate(new Date());

  return { ...message, ts_utc };
};
