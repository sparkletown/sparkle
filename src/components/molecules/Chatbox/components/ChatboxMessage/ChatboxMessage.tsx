import React from "react";
import { startOfDay } from "date-fns";

import { MessageToDisplay } from "types/chat";

import { checkIfPollMessage } from "utils/chat";
import { WithId } from "utils/id";
import { formatDateRelativeToNow } from "utils/time";

import { useVenuePoll } from "hooks/useVenuePoll";

import { ChatMessage as ChatMessageComponent } from "components/atoms/ChatMessage";
import { ChatPoll } from "components/molecules/ChatPoll";

import "./ChatboxMessage.scss";

export interface ChatboxMessageProps {
  message: WithId<MessageToDisplay>;
  nextMessage?: WithId<MessageToDisplay>;

  voteInPoll: ReturnType<typeof useVenuePoll>["voteInPoll"];
}

export const ChatboxMessage: React.FC<ChatboxMessageProps> = ({
  message,
  nextMessage,
  voteInPoll,
}) => {
  const messageStartOfDay = startOfDay(message.timestamp.toDate());

  const nextMessageDate = nextMessage?.timestamp.toDate();
  const nextMessageStartOfDay = nextMessageDate
    ? startOfDay(nextMessageDate)
    : undefined;

  const renderedMessage = checkIfPollMessage(message) ? (
    <ChatPoll key={message.id} pollMessage={message} voteInPoll={voteInPoll} />
  ) : (
    <ChatMessageComponent key={message.id} message={message} />
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
