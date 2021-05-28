import React, { useMemo, useState, useCallback } from "react";

import {
  DeleteMessage,
  MessageToDisplay,
  SendChatReply,
  SendMesssage,
  ChatOptionType,
} from "types/chat";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { checkIfPollMessage } from "utils/chat";

import { ChatMessageBox } from "components/molecules/ChatMessageBox";
import { ChatPoll } from "components/molecules/ChatPoll";
import { PollBox } from "components/molecules/PollBox";

import { ChatMessage } from "components/atoms/ChatMessage";

import { ChatboxThreadControls } from "./components/ChatboxThreadControls";
import { ChatboxOptionsControls } from "./components/ChatboxOptionsControls";

import { useVenuePoll } from "hooks/useVenuePoll";

import "./Chatbox.scss";

export interface ChatboxProps {
  messages: WithId<MessageToDisplay>[];
  venue: WithId<AnyVenue>;
  sendMessage: SendMesssage;
  sendThreadReply: SendChatReply;
  deleteMessage: DeleteMessage;
  displayPoll?: boolean;
}

export const Chatbox: React.FC<ChatboxProps> = ({
  messages,
  venue,
  sendMessage,
  sendThreadReply,
  deleteMessage,
  displayPoll,
}) => {
  const { createPoll, voteInPoll } = useVenuePoll();

  const [selectedThread, setSelectedThread] = useState<
    WithId<MessageToDisplay>
  >();

  const closeThread = useCallback(() => setSelectedThread(undefined), []);

  const [activeOption, setActiveOption] = useState<ChatOptionType>();

  const renderedMessages = useMemo(
    () =>
      messages.map((message) =>
        checkIfPollMessage(message) ? (
          <ChatPoll
            key={message.id}
            pollMessage={message}
            deletePollMessage={deleteMessage}
            voteInPoll={voteInPoll}
            venue={venue}
          />
        ) : (
          <ChatMessage
            key={message.id}
            message={message}
            deleteMessage={deleteMessage}
            selectThisThread={() => setSelectedThread(message)}
          />
        )
      ),
    [messages, deleteMessage, voteInPoll, venue]
  );

  return (
    <div className="Chatbox">
      <div className="Chatbox__messages">{renderedMessages}</div>
      <div className="Chatbox__form-box">
        {selectedThread && (
          <ChatboxThreadControls
            threadAuthor={selectedThread.author.partyName}
            closeThread={closeThread}
          />
        )}
        {displayPoll && !selectedThread && (
          <ChatboxOptionsControls
            activeOption={activeOption}
            setActiveOption={setActiveOption}
          />
        )}
        {activeOption === ChatOptionType.poll ? (
          <PollBox createPoll={createPoll} />
        ) : (
          <ChatMessageBox
            selectedThread={selectedThread}
            sendMessage={sendMessage}
            sendThreadReply={sendThreadReply}
          />
        )}
      </div>
    </div>
  );
};
