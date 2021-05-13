import firebase from "firebase/app";

import { WithId, withId } from "utils/id";
import { isTruthy } from "utils/types";

import {
  BaseChatMessage,
  ChatMessage,
  MessageToDisplay,
  PreviewChatMessageToDisplay,
  PreviewChatMessage,
  PrivateChatMessage,
} from "types/chat";
import { User } from "types/User";

export const chatSort: (a: BaseChatMessage, b: BaseChatMessage) => number = (
  a: BaseChatMessage,
  b: BaseChatMessage
) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf());

export interface GetMessageToDisplayProps<T extends object> {
  message: T;
  usersById: Partial<Record<string, User>>;
  myUserId?: string;
  replies?: T[];
  isAdmin?: boolean;
}

export const getMessageToDisplay = <
  T extends WithId<ChatMessage> = WithId<ChatMessage>
>({
  message,
  usersById,
  myUserId,
  replies,
  isAdmin,
}: GetMessageToDisplayProps<T>): WithId<MessageToDisplay<T>> | undefined => {
  const user = usersById[message.from];

  if (!user) return undefined;

  const repliesToDisplay = replies
    ?.map((reply) =>
      getMessageToDisplay({
        message: reply,
        usersById,
        myUserId,
        isAdmin,
      })
    )
    .filter(isTruthy);

  const isMine = myUserId === message.from;

  return {
    ...message,
    author: withId(user, message.from),
    isMine,
    replies: repliesToDisplay,
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

export interface DivideMessagesReturn<T extends object> {
  messages: WithId<T>[];
  allMessagesReplies: WithId<T>[];
}

export const divideMessages = <T extends ChatMessage>(
  messages: WithId<T>[]
): DivideMessagesReturn<T> =>
  messages.reduce<DivideMessagesReturn<T>>(
    (acc, message) => {
      if (message.threadId !== undefined)
        return {
          ...acc,
          allMessagesReplies: [...acc.allMessagesReplies, message],
        };

      return { ...acc, messages: [...acc.messages, message] };
    },
    { messages: [], allMessagesReplies: [] }
  );

export interface GetMessageRepliesProps<T extends object> {
  messageId: string;
  allReplies: WithId<T>[];
}

export const getMessageReplies = <T extends ChatMessage>({
  messageId,
  allReplies,
}: GetMessageRepliesProps<T>) => {
  const messageReplies = allReplies.filter(
    (reply) => reply.threadId === messageId
  );

  if (messageReplies.length === 0) return undefined;

  return messageReplies;
};
