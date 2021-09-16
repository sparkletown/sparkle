import {
  faPoll,
  faQuestion,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/app";

import { User } from "types/User";

import { WithId } from "utils/id";

export enum ChatMessageType {
  poll = "poll",
}

export type ChatUser = Pick<User, "partyName" | "pictureUrl" | "anonMode">;

export type BaseChatMessage = {
  from: WithId<ChatUser>;
  text: string;
  ts_utc: firebase.firestore.Timestamp;
  threadId?: string;
  deleted?: boolean;
  isQuestion?: boolean;
};

export type PrivateChatMessage = BaseChatMessage & {
  to: WithId<ChatUser>;
  isRead?: boolean;
};

export type VenueChatMessage = BaseChatMessage;

export type PollMessage = BaseChatMessage & {
  type: ChatMessageType.poll;
  poll: PollValues;
  votes: PollVote[];
};

export type JukeboxMessage = BaseChatMessage & {
  tableId: string;
};

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

export type PreviewChatMessageMap = { [key: string]: PreviewChatMessage };

export enum ChatTypes {
  WORLD_CHAT = "WORLD_CHAT",
  VENUE_CHAT = "VENUE_CHAT",
  PRIVATE_CHAT = "PRIVATE_CHAT",
}

export type PrivateChatSettings = {
  openedChatType: ChatTypes.PRIVATE_CHAT;
  recipient?: WithId<ChatUser>;
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
