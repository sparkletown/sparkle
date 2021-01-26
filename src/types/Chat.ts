export enum CHAT_TYPES {
  WORLD_CHAT = "WORLD_CHAT",
  VENUE_CHAT = "VENUE_CHAT",
  PRIVATE_CHAT = "PRIVATE_CHAT",
}

type SetPrivateChatTab = {
  chatType: CHAT_TYPES.PRIVATE_CHAT;
  recipientId: string | null;
};

type SetVenueChatTab = {
  chatType: CHAT_TYPES.VENUE_CHAT;
};

export type SetAnyChatTabOptions = SetPrivateChatTab | SetVenueChatTab;
