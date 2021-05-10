import { WithId } from "utils/id";
import { User } from "types/User";

// Change this together with functions/chat.js turnMessageIntoThread function
export enum MessageType {
  THREAD = "THREAD",
  THREAD_CHILD = "THREAD_CHILD",
}

export type BaseChatMessage = {
  from: string;
  text: string;
  ts_utc: firebase.firestore.Timestamp;
  deleted?: boolean;
  type?: MessageType;
};

export type ParentThreadMessage = BaseChatMessage & {
  type: MessageType.THREAD;
};

export type ChildThreadMessage = BaseChatMessage & {
  type: MessageType.THREAD_CHILD;
  threadId: string;
};

export type PrivateChatMessage = BaseChatMessage & {
  to: string;
  isRead?: boolean;
};

export type VenueChatMessage =
  | BaseChatMessage
  | ParentThreadMessage
  | ChildThreadMessage;

export type ChatMessage = PrivateChatMessage | VenueChatMessage;

export type MessageToDisplay<T extends ChatMessage = ChatMessage> = T & {
  author: WithId<User>;
  isMine: boolean;
  canBeDeleted?: boolean;
};

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
