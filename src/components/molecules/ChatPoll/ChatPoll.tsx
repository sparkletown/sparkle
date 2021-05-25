import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoll } from "@fortawesome/free-solid-svg-icons";

import { PollMessage, BaseMessageToDisplay, Vote } from "types/chat";

import { WithId } from "utils/id";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";
import Button from "components/atoms/Button";

import { useUser } from "hooks/useUser";

import "./ChatPoll.scss";

export interface ChatPollProps {
  pollMessage: WithId<BaseMessageToDisplay<PollMessage>>;
  deletePoll: (pollId: string) => void;
  voteInPoll: (votes: Vote[], pollId: string) => void;
}

export const ChatPoll: React.FC<ChatPollProps> = ({
  pollMessage,
  voteInPoll,
  deletePoll,
}) => {
  const { userId } = useUser();

  const { id, poll, votes, isMine } = pollMessage;
  const { questions, topic } = poll;
  // canBeDeleted: isAdmin && owners.includes(userId)
  const canBeDeleted = false;

  const isVoted = userId
    ? votes.map(({ userId }) => userId).includes(userId)
    : false;

  const message = useMemo(() => ({ ...pollMessage, canBeDeleted }), [
    pollMessage,
    canBeDeleted,
  ]);

  const containerStyles = classNames("ChatPoll", {
    "ChatPoll--me": isMine,
  });

  const formattedQuestions = questions
    .map((item) => ({
      ...item,
      count: votes.length
        ? Math.floor(
            (votes.filter(({ questionId }) => questionId === item.id).length /
              votes.length) *
              100
          )
        : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const handleVote = useCallback(
    (question) => {
      if (!userId) return;

      const newVote = {
        questionId: question.id,
        userId,
      };

      voteInPoll([...votes, newVote], id);
    },
    [id, voteInPoll, votes, userId]
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
        </div>
      </div>

      <ChatMessageInfo
        message={message}
        reversed={isMine}
        // deleteVenueMessage instead of deletePoll
        deleteMessage={() => {}}
      />
    </div>
  );
};
