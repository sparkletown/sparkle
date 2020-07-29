import React, { useCallback } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import firebase from "firebase/app";
import { useSelector } from "hooks/useSelector";

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

interface GlobalChatMessage {
  type: "global";
  from: string;
  text: string;
}

export enum RestrictedMessageType {
  room = "room",
  table = "table",
}

export interface RestrictedChatMessage {
  type: RestrictedMessageType;
  from: string;
  to: string;
  text: string;
  ts_utc: Time;
}

export interface PrivateChatMessage {
  type: "private";
  from: string;
  to: string;
  text: string;
  ts_utc: Time;
  isRead: boolean;
}

type ChatMessage =
  | GlobalChatMessage
  | RestrictedChatMessage
  | PrivateChatMessage;

// @debt typing this can be typed better
function buildMessage(
  type: RestrictedMessageType,
  text: string,
  from: string,
  to: string
): ChatMessage;
function buildMessage(
  type: "private",
  text: string,
  from: string,
  to: string
): ChatMessage;
function buildMessage(
  type: "global",
  text: string,
  from: string,
  to: undefined
): ChatMessage;
function buildMessage(
  type: any,
  text: string,
  from: string,
  to: any
): ChatMessage {
  let message: ChatMessage = {
    type,
    ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
    text,
    from,
  };

  if (type !== "global") {
    message = {
      ...message,
      to,
    } as RestrictedChatMessage;
  }

  if (type === "private") {
    message = {
      ...message,
      isRead: false,
    } as PrivateChatMessage;
  }

  return message;
}

export const ChatContextWrapper: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { venue } = useSelector((state) => ({
    venue: state.firestore.ordered.currentVenue?.[0],
  }));

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
        .add(buildMessage("global", text, from, undefined));
    },
    [chatCollectionName]
  );

  const sendRoomChat = useCallback(
    (from, to, text) => {
      const firestore = firebase.firestore();
      firestore
        .collection(chatCollectionName)
        .add(buildMessage(RestrictedMessageType.room, text, from, to));
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
        .add(buildMessage("private", text, from, to));
    }
  }, []);

  const sendTableChat = useCallback(
    (from, to, text) => {
      const firestore = firebase.firestore();
      firestore
        .collection(chatCollectionName)
        .add(buildMessage(RestrictedMessageType.table, text, from, to));
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
