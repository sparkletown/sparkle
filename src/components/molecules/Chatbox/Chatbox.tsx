import React, { useMemo, useState, useCallback } from "react";

import {
  DeleteMessage,
  MessageToDisplay,
  SendChatReply,
  SendMesssage,
  ChatOption,
  ChatMessageOptions,
  isPollMessage,
} from "types/chat";

import { WithId } from "utils/id";

import { ChatMessageBox } from "components/molecules/ChatMessageBox";
import { ChatPoll } from "components/molecules/ChatPoll";
import { PollBox } from "components/molecules/PollBox";

import { ChatMessage } from "components/atoms/ChatMessage";

import { ChatboxThreadControls } from "./components/ChatboxThreadControls";

import { useVenuePoll } from "hooks/useVenuePoll";

import "./Chatbox.scss";
import { ChatboxOptionsControls } from "./components/ChatboxOptionsControls";

export interface ChatboxProps {
  messages: WithId<MessageToDisplay>[];
  sendMessage: SendMesssage;
  sendThreadReply: SendChatReply;
  deleteMessage: DeleteMessage;
  displayPoll?: boolean;
}

export const Chatbox: React.FC<ChatboxProps> = ({
  messages,
  sendMessage,
  sendThreadReply,
  deleteMessage,
  displayPoll,
}) => {
  const { createPoll, deletePoll, voteInPoll } = useVenuePoll();

  const [selectedThread, setSelectedThread] = useState<
    WithId<MessageToDisplay>
  >();

  const closeThread = useCallback(() => setSelectedThread(undefined), []);

  const [activeOption, setActiveOption] = useState<ChatOption>();

  const closeQuestionOption = () => {
    setActiveOption(undefined);
  };

  const isQuestionOptions = useMemo(() => {
    return ChatMessageOptions.question === activeOption;
  }, [activeOption]);

  const renderedMessages = useMemo(
    () =>
      messages.map((message) =>
        isPollMessage(message) ? (
          <ChatPoll
            key={message.id}
            pollData={message}
            deletePoll={deletePoll}
            voteInPoll={voteInPoll}
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
    [messages, deleteMessage, deletePoll, voteInPoll]
  );

  return (
    <div className="Chatbox">
      <div className="Chatbox__messages">{renderedMessages}</div>
      <div className="Chatbox__form-box">
        {selectedThread && (
          <ChatboxThreadControls
            text="replying to"
            threadAuthor={selectedThread.author.partyName}
            closeThread={closeThread}
          />
        )}
        {displayPoll && !isQuestionOptions && (
          <ChatboxOptionsControls
            activeOption={activeOption}
            setActiveOption={setActiveOption}
          />
        )}
        {activeOption === ChatMessageOptions.question && (
          <ChatboxThreadControls
            threadAuthor="asking a question"
            closeThread={closeQuestionOption}
          />
        )}
        {activeOption === ChatMessageOptions.poll ? (
          <PollBox createPoll={createPoll} />
        ) : (
          <ChatMessageBox
            selectedThread={selectedThread}
            sendMessage={sendMessage}
            sendThreadReply={sendThreadReply}
            isQuestion={isQuestionOptions}
          />
        )}
      </div>
    </div>
  );
};
