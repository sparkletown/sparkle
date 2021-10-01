import firebase from "firebase/app";
import { has, pick } from "lodash";

import {
  ChatMessage,
  ChatMessageType,
  PollMessage,
  PreviewChatMessage,
  PrivateChatMessage,
} from "types/chat";
import { DisplayUser, User } from "types/User";

import { WithId } from "utils/id";

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
  fromUser: WithId<DisplayUser>,
  message: Pick<T, Exclude<keyof T, "timestamp" | "fromUser">>
) => ({
  ...message,
  fromUser: pickDisplayUserFromUser(fromUser),
  timestamp: firebase.firestore.Timestamp.now(),
});

export const pickDisplayUserFromUser = (
  user: WithId<User>
): WithId<DisplayUser> =>
  pick(user, "id", "partyName", "pictureUrl", "anonMode");

export const isNewSchemaMessage = <T extends ChatMessage>(
  message: WithId<T>
) => {
  if (!("fromUser" in message && "timestamp" in message)) return false;
  if ("to" in message && !("toUser" in message)) return false;

  return has(message.fromUser, "id");
};

export const filterNewSchemaMessages = <T extends ChatMessage>(
  messages: WithId<T>[] | undefined
) => messages?.filter(isNewSchemaMessage);

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
