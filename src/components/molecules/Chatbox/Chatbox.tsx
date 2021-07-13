import React, { useMemo, useState, useCallback } from "react";

import {
  DeleteMessage,
  MessageToDisplay,
  SendChatReply,
  SendMessage,
  ChatOptionType,
} from "types/chat";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { checkIfPollMessage } from "utils/chat";

import { ChatMessageBox } from "components/molecules/ChatMessageBox";
import { ChatPoll } from "components/molecules/ChatPoll";
import { PollBox } from "components/molecules/PollBox";
import { ChatMessage } from "components/atoms/ChatMessage";

import { useVenuePoll } from "hooks/useVenuePoll";

import { ChatboxThreadControls } from "./components/ChatboxThreadControls";
import { ChatboxOptionsControls } from "./components/ChatboxOptionsControls";

import "./Chatbox.scss";

export interface ChatboxProps {
  messages: WithId<MessageToDisplay>[];
  venue: WithId<AnyVenue>;
  sendMessage: SendMessage;
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
  displayPoll: isDisplayedPoll,
}) => {
  const { createPoll, voteInPoll } = useVenuePoll();

  const [selectedThread, setSelectedThread] = useState<
    WithId<MessageToDisplay>
  >();

  const closeThread = useCallback(() => setSelectedThread(undefined), []);

  const [activeOption, setActiveOption] = useState<ChatOptionType>();

  const unselectOption = useCallback(() => {
    setActiveOption(undefined);
  }, []);

  // @debt createPoll should be returning Promise; make sense to use useAsync here
  const onPollSubmit = useCallback(
    (data) => {
      createPoll(data);
      unselectOption();
    },
    [createPoll, unselectOption]
  );

  const isQuestionOptions = ChatOptionType.question === activeOption;

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

  const onReplyToThread = useCallback(
    ({ replyText, threadId }) => {
      sendThreadReply({ replyText, threadId });
      unselectOption();
      closeThread();
    },
    [unselectOption, closeThread, sendThreadReply]
  );

  return (
    <div className="Chatbox">
      <div className="Chatbox__messages">{renderedMessages}</div>
      <div className="Chatbox__form-box">
        {/* @debt sort these out. Preferrably using some kind of enum */}
        {selectedThread && (
          <ChatboxThreadControls
            text="replying to"
            threadAuthor={selectedThread.author.partyName}
            closeThread={closeThread}
          />
        )}
        {isQuestionOptions && !selectedThread && (
          <ChatboxThreadControls
            text="asking a question"
            closeThread={unselectOption}
          />
        )}
        {isDisplayedPoll && !isQuestionOptions && !selectedThread && (
          <ChatboxOptionsControls
            activeOption={activeOption}
            setActiveOption={setActiveOption}
          />
        )}
        {activeOption === ChatOptionType.poll ? (
          <PollBox onPollSubmit={onPollSubmit} />
        ) : (
          <ChatMessageBox
            selectedThread={selectedThread}
            sendMessage={sendMessage}
            unselectOption={unselectOption}
            isQuestion={isQuestionOptions}
            onReplyToThread={onReplyToThread}
          />
        )}
      </div>
    </div>
  );
};
