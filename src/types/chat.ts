import {
  faPoll,
  faQuestion,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/app";

import { DisplayUser, User } from "types/User";

import { WithId } from "utils/id";

export enum ChatMessageType {
  poll = "poll",
}

export type BaseChatMessage = {
  fromUser: WithId<DisplayUser>;
  text: string;
  timestamp: firebase.firestore.Timestamp;
  threadId?: string;
  deleted?: boolean;
  isQuestion?: boolean;
};

export interface PrivateChatMessage extends BaseChatMessage {
  toUser: WithId<DisplayUser>;
  isRead?: boolean;
}

export interface VenueChatMessage extends BaseChatMessage {}

export interface PollMessage extends BaseChatMessage {
  type: ChatMessageType.poll;
  poll: PollValues;
  votes: PollVote[];
}

export interface JukeboxMessage extends BaseChatMessage {
  tableId: string;
}

export type PollVoteBase = {
  questionId: number;
  pollId: string;
};

export type PollVote = PollVoteBase & {
  userId: string;
};

export type ChatMessage =
  | PrivateChatMessage
  | VenueChatMessage
  | PollMessage
  | JukeboxMessage;

export type MessageToDisplay<T extends ChatMessage = ChatMessage> = T & {
  replies: WithId<T>[];
};

export interface SendMessageProps {
  message: string;
  isQuestion?: boolean;
}

export type SendMessage = (sendMessageProps: SendMessageProps) => Promise<void>;

export type DeleteMessage = (messageId: string) => Promise<void>;

export interface SendChatReplyProps {
  replyText: string;
  threadId: string;
}

export type SendChatReply = (props: SendChatReplyProps) => Promise<void>;

export type PreviewChatMessage = PrivateChatMessage & {
  counterPartyUser: WithId<User>;
};

export interface ChatActions {
  sendMessage: SendMessage;
  deleteMessage?: DeleteMessage;
  sendThreadReply: SendChatReply;
}

export type PreviewChatMessageMap = { [key: string]: PreviewChatMessage };

export enum ChatTypes {
  WORLD_CHAT = "WORLD_CHAT",
  VENUE_CHAT = "VENUE_CHAT",
  PRIVATE_CHAT = "PRIVATE_CHAT",
}

export type PrivateChatSettings = {
  openedChatType: ChatTypes.PRIVATE_CHAT;
  recipient?: WithId<DisplayUser>;
};

export type VenueChatSettings = {
  openedChatType: ChatTypes.VENUE_CHAT;
};

export type ChatSettings = PrivateChatSettings | VenueChatSettings;

export enum ChatOptionType {
  poll = "poll",
  question = "question",
}

export interface ChatOption {
  type: ChatOptionType;
  icon: IconDefinition;
  name: string;
}

export type PollQuestion = {
  name: string;
  id: number;
};

export type PollValues = {
  topic: string;
  questions: PollQuestion[];
};

export const ChatMessageOptions: ChatOption[] = [
  {
    type: ChatOptionType.poll,
    icon: faPoll,
    name: "Create Poll",
  },
  {
    type: ChatOptionType.question,
    icon: faQuestion,
    name: "Ask Question",
  },
];
