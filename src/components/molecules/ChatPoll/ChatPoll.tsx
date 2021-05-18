import React, { useMemo } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoll } from "@fortawesome/free-solid-svg-icons";

import { PollMessage, PollMessageToDisplay, PollQuestion } from "types/chat";

import { WithId } from "utils/id";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";
import { TextButton } from "components/atoms/TextButton";
import Button from "components/atoms/Button";

import "./ChatPoll.scss";

export interface ChatPollProps {
  pollData: WithId<PollMessageToDisplay<PollMessage>>;
  deletePoll: (pollId: string) => void;
  voteInPoll: (question: PollQuestion) => void;
}

export const ChatPoll: React.FC<ChatPollProps> = ({
  pollData,
  voteInPoll,
  deletePoll,
}) => {
  const { id, poll, isMine, canBeDeleted } = pollData;
  // temp
  const votes = 8;
  const { questions, topic } = poll;

  const containerStyles = classNames("ChatPoll", {
    "ChatPoll--me": isMine,
  });

  const renderQuestions = useMemo(
    () =>
      questions.map((question: PollQuestion) =>
        isMine ? (
          <div key={question.name} className="ChatPoll__text">
            {question.name}
          </div>
        ) : (
          <Button
            key={question.name}
            customClass="ChatPoll__question"
            onClick={() => voteInPoll(question)}
          >
            {question.name}
          </Button>
        )
      ),
    [questions, isMine, voteInPoll]
  );

  return (
    <div className={containerStyles}>
      <div className="ChatPoll__bulb">
        <FontAwesomeIcon className="ChatPoll__icon" icon={faPoll} size="lg" />
        <div className="ChatPoll__topic">{topic}</div>
        {renderQuestions}
        <div className="ChatPoll__details">
          <span className="ChatPoll__votes">{`${votes} votes`}</span>
          {canBeDeleted && (
            <>
              -
              <TextButton
                containerClassName="ChatPoll__delete-button"
                onClick={() => deletePoll(id)}
                label="Delete Poll"
              />
            </>
          )}
        </div>
      </div>

      <ChatMessageInfo
        message={pollData}
        reversed={isMine}
        deleteMessage={() => {}}
      />
    </div>
  );
};
