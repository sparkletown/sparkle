import React from "react";
import { startOfDay } from "date-fns";

import { DeleteMessage, MessageToDisplay } from "types/chat";

import { checkIfPollMessage } from "utils/chat";
import { WithId } from "utils/id";
import { formatDateRelativeToNow } from "utils/time";

import { useVenuePoll } from "hooks/useVenuePoll";

import { ChatPoll } from "components/molecules/ChatPoll";

import {
  ChatMessage,
  ChatProps,
} from "components/atoms/ChatMessage/ChatMessage";

import "./ChatboxMessage.scss";

export interface ChatboxMessageProps {
  message: WithId<MessageToDisplay>;
  nextMessage?: WithId<MessageToDisplay>;

  deleteMessage?: DeleteMessage;
  voteInPoll: ReturnType<typeof useVenuePoll>["voteInPoll"];
  selectThisThread: ChatProps["selectThisThread"];
}

export const ChatboxMessage: React.FC<ChatboxMessageProps> = ({
  message,
  nextMessage,
  deleteMessage,
  voteInPoll,
  selectThisThread,
}) => {
  const messageStartOfDay = startOfDay(message.ts_utc.toDate());

  const nextMessageDate = nextMessage?.ts_utc.toDate();
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
    <ChatMessage
      key={message.id}
      message={message}
      deleteMessage={deleteMessage}
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
