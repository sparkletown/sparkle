import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoll } from "@fortawesome/free-solid-svg-icons";

import { PollMessage, BaseMessageToDisplay, PollValues } from "types/chat";

import { WithId } from "utils/id";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";
import { TextButton } from "components/atoms/TextButton";
import Button from "components/atoms/Button";

import "./ChatPoll.scss";

export interface ChatPollProps {
  pollData: WithId<BaseMessageToDisplay<PollMessage>>;
  deletePoll: (pollId: string) => void;
  voteInPoll: (poll: PollValues, pollId: string) => void;
}

export const ChatPoll: React.FC<ChatPollProps> = ({
  pollData,
  voteInPoll,
  deletePoll,
}) => {
  const { id, poll, votes, isMine, canBeDeleted } = pollData;
  const { questions, topic } = poll;
  // TODO: think about the way to check if user vote
  // save all votes userIds?
  const isVoted = false;

  const containerStyles = classNames("ChatPoll", {
    "ChatPoll--me": isMine,
  });

  const formattedQuestions = questions
    .map((item) => ({
      ...item,
      count: votes ? Math.floor(((item.votes || 0) / votes) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const handleVote = useCallback(
    (question) => {
      const newPoll = {
        topic,
        questions: questions.map((q) =>
          q.id === question.id
            ? {
                ...question,
                votes: question.votes + 1,
              }
            : q
        ),
      };
      voteInPoll(newPoll, id);
    },
    [topic, questions, id, voteInPoll]
  );

  const renderQuestions = useMemo(
    () =>
      questions.map((question) => (
        <Button
          key={question.name}
          customClass="ChatPoll__question"
          onClick={() => handleVote(question)}
        >
          {question.name}
        </Button>
      )),
    [questions, handleVote]
  );

  const renderCounts = useMemo(
    () =>
      formattedQuestions.map((question) => (
        <div key={question.name} className="ChatPoll__text">
          <div
            className="ChatPoll__text-background"
            style={{ width: `${question.count}%` }}
          />
          <span className="ChatPoll__text-count">{question.count}%</span>
          {question.name}
        </div>
      )),
    [formattedQuestions]
  );

  return (
    <div className={containerStyles}>
      <div className="ChatPoll__bulb">
        <FontAwesomeIcon className="ChatPoll__icon" icon={faPoll} size="lg" />
        <div className="ChatPoll__topic">{topic}</div>
        <div>{isMine || isVoted ? renderCounts : renderQuestions}</div>
        <div className="ChatPoll__details">
          <span>{`${votes} votes`}</span>
          {canBeDeleted && (
            <span className="ChatPoll__delete-container">
              -
              <TextButton
                containerClassName="ChatPoll__delete-button"
                onClick={() => deletePoll(id)}
                label="Delete Poll"
              />
            </span>
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
