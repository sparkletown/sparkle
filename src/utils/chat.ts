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
  BaseMessageToDisplay,
} from "types/chat";
import { User } from "types/User";

export const chatSort: (a: BaseChatMessage, b: BaseChatMessage) => number = (
  a: BaseChatMessage,
  b: BaseChatMessage
) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf());

export interface GetBaseMessageToDisplayProps<T extends WithId<ChatMessage>> {
  message: T;
  usersById: Partial<Record<string, User>>;
  myUserId?: string;
  isAdmin?: boolean;
}

export type GetBaseMessageToDisplay<
  T extends WithId<ChatMessage> = WithId<ChatMessage>
> = (
  props: GetBaseMessageToDisplayProps<T>
) => WithId<BaseMessageToDisplay<T>> | undefined;

export const getBaseMessageToDisplay: GetBaseMessageToDisplay = ({
  message,
  usersById,
  myUserId,
  isAdmin,
}) => {
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

export interface GetMessageToDisplayProps<T extends WithId<ChatMessage>>
  extends GetBaseMessageToDisplayProps<T> {
  replies: WithId<T>[];
}

export type GetMessageToDisplay = {
  <T extends WithId<ChatMessage>>(props: GetMessageToDisplayProps<T>):
    | MessageToDisplay<WithId<T>>
    | undefined;
};

export const getMessageToDisplay: GetMessageToDisplay = ({
  replies,
  usersById,
  myUserId,
  isAdmin,
  message,
}) => {
  const displayMessage = getBaseMessageToDisplay({
    usersById,
    myUserId,
    isAdmin,
    message,
  });

  if (!displayMessage) return;

  const repliesToDisplay = replies
    .map((reply) =>
      getBaseMessageToDisplay({
        message: reply,
        usersById,
        myUserId,
        isAdmin,
      })
    )
    .filter(isTruthy);

  return { ...displayMessage, replies: repliesToDisplay };
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
