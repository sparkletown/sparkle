import React, { useCallback } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import firebase from "firebase/app";
import { useSelector } from "hooks/useSelector";
import { currentVenueSelector } from "utils/selectors";

interface ChatContextType {
  sendGlobalChat: (from: string, text: string) => void;
  sendRoomChat: (from: string, to: string, text: string) => void;
  sendPrivateChat: (from: string, to: string, text: string) => void;
  sendTableChat: (from: string, to: string, text: string) => void;
}

export const ChatContext = React.createContext<ChatContextType | undefined>(
  undefined
);

type Time = firebase.firestore.Timestamp;

type RestrictedMessageType = "room" | "table";

interface BaseChatMessage {
  from: string;
  text: string;
  ts_utc: Time;
  deleted?: boolean;
}

interface BaseNonGlobalChatMessage extends BaseChatMessage {
  to: string;
}

export interface RestrictedChatMessage extends BaseNonGlobalChatMessage {
  type: RestrictedMessageType;
}

export interface PrivateChatMessage extends BaseNonGlobalChatMessage {
  type: "private";
  isRead: boolean;
}

interface GlobalChatMessage extends BaseChatMessage {
  type: "global";
}

export type ChatMessage =
  | GlobalChatMessage
  | RestrictedChatMessage
  | PrivateChatMessage;

interface BaseMessageBuilderInput {
  text: string;
  from: string;
}

export const chatSort: (a: BaseChatMessage, b: BaseChatMessage) => number = (
  a: BaseChatMessage,
  b: BaseChatMessage
) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf());

type MessageBuilderInput = BaseMessageBuilderInput &
  (
    | { type: RestrictedMessageType | "private"; to: string }
    | { type: "global" }
  );

// @debt typing this can be typed better
function buildMessage(data: MessageBuilderInput): ChatMessage {
  const baseMessage: BaseChatMessage = {
    ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
    text: data.text,
    from: data.from,
  };

  switch (data.type) {
    case "private":
      return { ...baseMessage, type: "private", to: data.to, isRead: false };
    case "room":
    case "table":
      return { ...baseMessage, type: data.type, to: data.to };
    case "global":
      return { ...baseMessage, type: "global" };
  }
}

export const ChatContextWrapper: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const venue = useSelector(currentVenueSelector);

  const chatCollectionName = `venues/${venue.id}/chats`;

  useFirestoreConnect({
    collection: "venues",
    doc: venue.id,
    subcollections: [{ collection: "chats" }],
    storeAs: "venueChats",
  });

  const sendGlobalChat = useCallback(
    (from, text) => {
      const firestore = firebase.firestore();
      firestore
        .collection(chatCollectionName)
        .add(buildMessage({ type: "global", text, from }));
    },
    [chatCollectionName]
  );

  const sendRoomChat = useCallback(
    (from, to, text) => {
      const firestore = firebase.firestore();
      firestore
        .collection(chatCollectionName)
        .add(buildMessage({ type: "room", text, from, to }));
    },
    [chatCollectionName]
  );

  const sendPrivateChat = useCallback((from, to, text) => {
    const firestore = firebase.firestore();
    for (const messageUser of [from, to]) {
      firestore
        .collection("privatechats")
        .doc(messageUser)
        .collection("chats")
        .add(buildMessage({ type: "private", text, from, to }));
    }
  }, []);

  const sendTableChat = useCallback(
    (from, to, text) => {
      const firestore = firebase.firestore();
      firestore
        .collection(chatCollectionName)
        .add(buildMessage({ type: "table", text, from, to }));
    },
    [chatCollectionName]
  );

  const store = {
    sendGlobalChat,
    sendRoomChat,
    sendPrivateChat,
    sendTableChat,
  };

  return <ChatContext.Provider value={store}>{children}</ChatContext.Provider>;
};
