import { WithId } from "utils/id";
import { User } from "types/User";
import firebase from "firebase/app";

export type BaseChatMessage = {
  from: string;
  text: string;
  ts_utc: firebase.firestore.Timestamp;
  deleted?: boolean;
  threadId?: string;
};

export type PrivateChatMessage = BaseChatMessage & {
  to: string;
  isRead?: boolean;
};

export type VenueChatMessage = BaseChatMessage;

export type ChatMessage = PrivateChatMessage | VenueChatMessage;

export type MessageToDisplay<T extends ChatMessage = ChatMessage> = T & {
  author: WithId<User>;
  isMine: boolean;
  canBeDeleted?: boolean;
  replies?: WithId<MessageToDisplay>[];
};

export type SendMesssage = (text: string) => Promise<void> | undefined;

export type DeleteMessage = (messageId: string) => Promise<void> | undefined;

export interface SendChatReplyProps {
  replyText: string;
  threadId: string;
}

export type SendChatReply = (
  props: SendChatReplyProps
) => Promise<void> | undefined;

export type PreviewChatMessage = PrivateChatMessage & {
  counterPartyUser: WithId<User>;
};

export type PreviewChatMessageMap = { [key: string]: PreviewChatMessage };

export type PreviewChatMessageToDisplay = PreviewChatMessage & {
  isMine: boolean;
};

export enum ChatTypes {
  WORLD_CHAT = "WORLD_CHAT",
  VENUE_CHAT = "VENUE_CHAT",
  PRIVATE_CHAT = "PRIVATE_CHAT",
}

export type PrivateChatSettings = {
  openedChatType: ChatTypes.PRIVATE_CHAT;
  recipientId?: string;
};

export type VenueChatSettings = {
  openedChatType: ChatTypes.VENUE_CHAT;
};

export type ChatSettings = PrivateChatSettings | VenueChatSettings;
