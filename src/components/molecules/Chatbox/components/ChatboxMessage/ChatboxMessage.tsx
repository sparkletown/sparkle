import React from "react";
import { startOfDay } from "date-fns";

import {
  BaseChatMessage,
  DeleteChatMessage,
  DeleteMessageProps,
  DeleteThreadMessageProps,
  MessageToDisplay,
} from "types/chat";

import { checkIfPollMessage } from "utils/chat";
import { WithId } from "utils/id";
import { formatDateRelativeToNow } from "utils/time";

import { useVenuePoll } from "hooks/useVenuePoll";

import { ChatPoll } from "components/molecules/ChatPoll";

import {
  ChatMessage as ChatMessageComponent,
  ChatProps,
} from "components/atoms/ChatMessage/ChatMessage";

import "./ChatboxMessage.scss";

export interface ChatboxMessageProps {
  message: WithId<MessageToDisplay>;
  nextMessage?: WithId<MessageToDisplay>;
  thread: WithId<BaseChatMessage>[];

  deleteMessage?: DeleteChatMessage<DeleteMessageProps>;
  deleteThreadReply?: DeleteChatMessage<DeleteThreadMessageProps>;
  voteInPoll: ReturnType<typeof useVenuePoll>["voteInPoll"];
  selectThisThread: ChatProps["selectThisThread"];
}

export const ChatboxMessage: React.FC<ChatboxMessageProps> = ({
  message,
  nextMessage,
  thread,
  deleteMessage,
  deleteThreadReply,
  voteInPoll,
  selectThisThread,
}) => {
  const messageStartOfDay = startOfDay(message.timestamp.toDate());

  const nextMessageDate = nextMessage?.timestamp.toDate();
  const nextMessageStartOfDay = nextMessageDate
    ? startOfDay(nextMessageDate)
    : undefined;

  const renderedMessage = checkIfPollMessage(message) ? (
    <ChatPoll
      key={message.id}
      pollMessage={message}
      deletePollMessage={deleteMessage}
      voteInPoll={voteInPoll}
    />
  ) : (
    <ChatMessageComponent
      key={message.id}
      message={message}
      thread={thread}
      deleteMessage={deleteMessage}
      deleteThreadReply={deleteThreadReply}
      selectThisThread={selectThisThread}
    />
  );

  const dateLabel =
    !nextMessageStartOfDay || nextMessageStartOfDay < messageStartOfDay
      ? formatDateRelativeToNow(messageStartOfDay)
      : undefined;

  return (
    <>
      {renderedMessage}
      {/* We should display labels above the first message of the particular day.

          But because the outer `Chatbox.tsx` reverses the components it renders
          we need `dateLabel` to be after `renderedMessage`.
      */}
      {dateLabel && (
        <div className="ChatboxMessage__date-label">{dateLabel}</div>
      )}
    </>
  );
};
