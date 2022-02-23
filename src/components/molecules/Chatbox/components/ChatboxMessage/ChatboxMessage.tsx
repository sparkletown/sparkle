import React from "react";
import { startOfDay } from "date-fns";

import { MessageToDisplay } from "types/chat";

import { checkIfPollMessage } from "utils/chat";
import { WithId } from "utils/id";
import { formatDateRelativeToNow } from "utils/time";

import { ChatMessage as ChatMessageComponent } from "components/atoms/ChatMessage";

export interface ChatboxMessageProps {
  message: WithId<MessageToDisplay>;
  nextMessage?: WithId<MessageToDisplay>;
}

export const ChatboxMessage: React.FC<ChatboxMessageProps> = ({
  message,
  nextMessage,
}) => {
  const messageStartOfDay = startOfDay(message.timestamp.toDate());

  const nextMessageDate = nextMessage?.timestamp.toDate();
  const nextMessageStartOfDay = nextMessageDate
    ? startOfDay(nextMessageDate)
    : undefined;

  // @debt We don't render polls at all. Maybe we should.
  const renderedMessage = checkIfPollMessage(message) ? (
    <></>
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
      {dateLabel && <div>{dateLabel}</div>}
    </>
  );
};
