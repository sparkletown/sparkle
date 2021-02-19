import firebase from "firebase/app";

import { WithId, withId } from "utils/id";

import {
  BaseChatMessage,
  ChatMessage,
  MessageToDisplay,
  PreviewChatMessageToDisplay,
  PreviewChatMessage,
  PrivateChatMessage,
} from "types/chat";
import { User } from "types/User";

export const chatSort: (a: BaseChatMessage, b: BaseChatMessage) => number = (
  a: BaseChatMessage,
  b: BaseChatMessage
) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf());

export interface GetMessageToDisplayProps<T> {
  message: T;
  usersById: Record<string, User>;
  myUserId?: string;
  isAdmin?: boolean;
}

export const getMessageToDisplay = <T extends ChatMessage = ChatMessage>({
  message,
  usersById,
  myUserId,
  isAdmin,
}: GetMessageToDisplayProps<T>): MessageToDisplay<T> => {
  const isMine = myUserId === message.from;

  return {
    ...message,
    author: withId(usersById[message.from], message.from),
    isMine,
    ...(isAdmin && { canBeDeleted: isAdmin }),
  };
};

export interface GetPreviewChatMessageProps {
  message: WithId<PrivateChatMessage>;
  user: WithId<User>;
}

export const getPreviewChatMessage = ({
  message,
  user,
}: GetPreviewChatMessageProps): PreviewChatMessage => ({
  ...message,
  counterPartyUser: user,
});

export interface GetPreviewChatMessageToDisplayProps {
  message: PreviewChatMessage;
  myUserId?: string;
}

export const getPreviewChatMessageToDisplay = ({
  message,
  myUserId,
}: GetPreviewChatMessageToDisplayProps): PreviewChatMessageToDisplay => ({
  ...message,
  isMine: myUserId === message.from,
});

export const buildMessage = <T extends ChatMessage>(
  message: Pick<T, Exclude<keyof T, "ts_utc">>
) => ({
  ...message,
  ts_utc: firebase.firestore.Timestamp.now(),
});
