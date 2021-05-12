import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { User } from "types/User";
import { WithId } from "utils/id";
import { isTruthy } from "utils/types";

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

export type PollMessage = BaseChatMessage & {
  pollData: PollData;
};

export type ChatMessage = PrivateChatMessage | VenueChatMessage | PollMessage;

export const isPollMessage = (r: unknown): r is PollMessage =>
  typeof r === "object" && isTruthy(r) && r.hasOwnProperty("pollData");

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

// @debt Remove it when UserProfileModal is refactored
export type SetSelectedProfile = (user: WithId<User>) => void;

export enum ChatOptionType {
  poll = "poll",
  question = "question",
}

export interface ChatOption {
  icon: IconDefinition;
  name: string;
}

export type ChatOptionMap = Record<ChatOptionType, ChatOption>;

export type PollQuestion = {
  name: string;
};

export type PollValues = {
  topic: string;
  questions: PollQuestion[];
};

export type PollData = {
  poll: PollValues;
  ts_utc: number;
  isMine: boolean;
  author: WithId<User>;
  canBeDeleted: boolean;
  votes: number;
  pollId: string;
};
