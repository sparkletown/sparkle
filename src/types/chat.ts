import { WithId } from "utils/id";
import { User } from "types/User";

export type BaseChatMessage = {
  from: string;
  text: string;
  ts_utc: firebase.firestore.Timestamp;
  deleted?: boolean;
};

export type PrivateChatMessage = BaseChatMessage & {
  to: string;
  isRead?: boolean;
};

export type VenueChatMessage = BaseChatMessage & {};

export type ChatMessage = PrivateChatMessage | VenueChatMessage;

export type MessageToDisplay = ChatMessage & {
  author: WithId<User>;
  isMine: boolean;
};

export type PreviewChatMessage = PrivateChatMessage & {
  counterPartyUserId: string;
};

export type PreviewChatMessageToDisplay = PrivateChatMessage & {
  counterPartyUser: WithId<User>;
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
