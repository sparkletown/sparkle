import firebase from "firebase/app";

import {
  BaseChatMessage,
  BaseMessageToDisplay,
  ChatMessage,
  ChatMessageType,
  PollMessage,
  PreviewChatMessage,
  PreviewChatMessageToDisplay,
  PrivateChatMessage,
} from "types/chat";
import { User } from "types/User";

import { WithId, withId } from "utils/id";

export const chatSort: (a: BaseChatMessage, b: BaseChatMessage) => number = (
  a: BaseChatMessage,
  b: BaseChatMessage
) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf());

export interface GetBaseMessageToDisplayProps<T extends ChatMessage> {
  message: T;
  usersById: Partial<Record<string, User>>;
  myUserId?: string;
  isAdmin?: boolean;
}

export type GetBaseMessageToDisplayReturn<T extends ChatMessage> =
  | BaseMessageToDisplay<T>
  | undefined;

export const getBaseMessageToDisplay = <T extends ChatMessage>({
  message,
  usersById,
  myUserId,
  isAdmin,
}: GetBaseMessageToDisplayProps<T>): GetBaseMessageToDisplayReturn<T> => {
  const user = usersById[message.from];

  if (!user) return undefined;

  const isMine = myUserId === message.from;

  return {
    ...message,
    author: withId(user, message.from),
    isMine,
    ...(isAdmin && { canBeDeleted: isAdmin }),
  };
};

export interface GetPreviewChatMessageProps {
  message: WithId<PrivateChatMessage>;
  user: WithId<User>;
}

export const getPreviewChatMessage = ({
  message,
  user,
}: GetPreviewChatMessageProps): PreviewChatMessage => ({
  ...message,
  counterPartyUser: user,
});

export interface GetPreviewChatMessageToDisplayProps {
  message: PreviewChatMessage;
  myUserId?: string;
}

export const getPreviewChatMessageToDisplay = ({
  message,
  myUserId,
}: GetPreviewChatMessageToDisplayProps): PreviewChatMessageToDisplay => ({
  ...message,
  isMine: myUserId === message.from,
});

export const buildMessage = <T extends ChatMessage>(
  message: Pick<T, Exclude<keyof T, "ts_utc">>
) => ({
  ...message,
  ts_utc: firebase.firestore.Timestamp.now(),
});

export interface PartitionMessagesFromRepliesReturn<T extends object> {
  messages: WithId<T>[];
  allMessagesReplies: WithId<T>[];
}

export const partitionMessagesFromReplies = <T extends ChatMessage>(
  messages: WithId<T>[]
): PartitionMessagesFromRepliesReturn<T> =>
  messages.reduce<PartitionMessagesFromRepliesReturn<T>>(
    (acc, message) =>
      message.threadId !== undefined
        ? {
            ...acc,
            allMessagesReplies: [...acc.allMessagesReplies, message],
          }
        : { ...acc, messages: [...acc.messages, message] },
    { messages: [], allMessagesReplies: [] }
  );

export interface GetMessageRepliesProps<T extends object> {
  messageId: string;
  allReplies: WithId<T>[];
}

export const getMessageReplies = <T extends ChatMessage>({
  messageId,
  allReplies,
}: GetMessageRepliesProps<T>) =>
  allReplies.filter((reply) => reply.threadId === messageId);

export const checkIfPollMessage = (
  message: ChatMessage
): message is PollMessage => {
  if ("type" in message) {
    return message.type === ChatMessageType.poll;
  }

  return false;
};
