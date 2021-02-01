export enum ChatTypes {
  WORLD_CHAT = "WORLD_CHAT",
  VENUE_CHAT = "VENUE_CHAT",
  PRIVATE_CHAT = "PRIVATE_CHAT",
}

type SetPrivateChatTab = {
  chatType: ChatTypes.PRIVATE_CHAT;
  recipientId?: string;
};

type SetVenueChatTab = {
  chatType: ChatTypes.VENUE_CHAT;
};

export type SetAnyChatTabOptions = SetPrivateChatTab | SetVenueChatTab;
