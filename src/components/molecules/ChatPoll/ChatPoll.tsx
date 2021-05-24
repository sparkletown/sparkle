import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoll } from "@fortawesome/free-solid-svg-icons";

import { PollMessage, BaseMessageToDisplay, PollValues } from "types/chat";

import { WithId } from "utils/id";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";
import { TextButton } from "components/atoms/TextButton";
import Button from "components/atoms/Button";

import { useUser } from "hooks/useUser";

import "./ChatPoll.scss";

export interface ChatPollProps {
  pollData: WithId<BaseMessageToDisplay<PollMessage>>;
  deletePoll: (pollId: string) => void;
  voteInPoll: (poll: PollValues, votes: string[], pollId: string) => void;
}

export const ChatPoll: React.FC<ChatPollProps> = ({
  pollData,
  voteInPoll,
  deletePoll,
}) => {
  const { user } = useUser();

  const userId = user?.uid;

  const { id, poll, votes, isMine } = pollData;
  const { questions, topic, canBeDeleted } = poll;

  const isVoted = userId ? votes.includes(userId) : false;

  const containerStyles = classNames("ChatPoll", {
    "ChatPoll--me": isMine,
  });

  const formattedQuestions = questions
    .map((item) => ({
      ...item,
      count: votes.length
        ? Math.floor(((item.votes || 0) / votes.length) * 100)
        : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const handleVote = useCallback(
    (question) => {
      if (!userId) return;

      const newVotes = [...votes, userId];

      const newPoll = {
        ...poll,
        questions: poll.questions.map((q) =>
          q.id === question.id
            ? {
                ...question,
                // think about to save all polling userIds
                votes: question.votes + 1,
              }
            : q
        ),
      };
      voteInPoll(newPoll, newVotes, id);
    },
    [poll, id, voteInPoll, votes, userId]
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
          <span>{`${votes.length} votes`}</span>
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
        message={{ ...pollData, canBeDeleted }}
        reversed={isMine}
        deleteMessage={() => {}}
      />
    </div>
  );
};
