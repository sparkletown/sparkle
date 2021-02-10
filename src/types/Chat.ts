export enum ChatTypes {
  WORLD_CHAT = "WORLD_CHAT",
  VENUE_CHAT = "VENUE_CHAT",
  PRIVATE_CHAT = "PRIVATE_CHAT",
}

export type BaseChatMessage = {
  from: string;
  text: string;
  ts_utc: firebase.firestore.Timestamp;
  deleted?: boolean;
};

export type PrivateChatMessage = BaseChatMessage & {
  to: string;
};

export type VenueChatMessage = BaseChatMessage & {};

export type ChatMessage = PrivateChatMessage | VenueChatMessage;

type SetPrivateChatTab = {
  chatType: ChatTypes.PRIVATE_CHAT;
  recipientId?: string;
};

type SetVenueChatTab = {
  chatType: ChatTypes.VENUE_CHAT;
};

export type SetAnyChatTabOptions = SetPrivateChatTab | SetVenueChatTab;
