import firebase from "firebase/app";
import { has, isString, pick } from "lodash";

import {
  BaseChatMessage,
  ChatMessage,
  ChatMessageType,
  ChatUser,
  PollMessage,
  PreviewChatMessage,
  PrivateChatMessage,
} from "types/chat";
import { User } from "types/User";

import { WithId } from "utils/id";

export const chatSort: (a: BaseChatMessage, b: BaseChatMessage) => number = (
  a: BaseChatMessage,
  b: BaseChatMessage
) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf());

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

export const buildMessage = <T extends ChatMessage>(
  from: WithId<ChatUser>,
  message: Pick<T, Exclude<keyof T, "ts_utc" | "from">>
) => ({
  ...message,
  from: pickChatUserFromUser(from),
  ts_utc: firebase.firestore.Timestamp.now(),
});

export const pickChatUserFromUser = (user: WithId<User>) =>
  pick(user, "id", "partyName", "pictureUrl", "anonMode") as WithId<ChatUser>;

export const messageContainsUserObject = <T extends ChatMessage>(
  message: WithId<T>
) => {
  if (isString(message.from)) return false;
  return has(message, "id");
};

export const filterMessagesWithUserObject = <T extends ChatMessage>(
  messages: WithId<T>[] | undefined
) => messages?.filter(messageContainsUserObject);

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
