import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faPoll, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { User } from "types/User";
import { WithId } from "utils/id";
import { isTruthy } from "utils/types";
import firebase from "firebase/app";

export type BaseChatMessage = {
  from: string;
  text: string;
  ts_utc: firebase.firestore.Timestamp;
  deleted?: boolean;
  threadId?: string;
  isQuestion?: boolean;
};

export type PrivateChatMessage = BaseChatMessage & {
  to: string;
  isRead?: boolean;
};

export type VenueChatMessage = BaseChatMessage;

export type PollMessage = BaseChatMessage & {
  poll: PollValues;
  votes: string[];
};

export type ChatMessage = PrivateChatMessage | VenueChatMessage | PollMessage;

export const isPollMessage = (r: unknown): r is PollMessage =>
  typeof r === "object" && isTruthy(r) && r.hasOwnProperty("poll");

export type BaseMessageToDisplay<T extends ChatMessage = ChatMessage> = T & {
  author: WithId<User>;
  isMine: boolean;
  canBeDeleted?: boolean;
};

export type MessageToDisplay<
  T extends ChatMessage = ChatMessage
> = BaseMessageToDisplay<T> & {
  replies: WithId<BaseMessageToDisplay<T>>[];
};

export interface SendMesssageProps {
  text: string;
  isQuestion: boolean;
}

export type SendMesssage = (
  message: SendMesssageProps
) => Promise<void> | undefined;

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
  id?: number;
  votes?: number;
};

export type PollValues = {
  topic: string;
  questions: PollQuestion[];
};

export const ChatMessageOptions: ChatOptionMap = {
  poll: {
    icon: faPoll,
    name: "Create Poll",
  },
  question: {
    icon: faQuestion,
    name: "Ask Question",
  },
};
