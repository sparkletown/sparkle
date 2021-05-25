import React, { useState, useCallback, useEffect, useMemo } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoll } from "@fortawesome/free-solid-svg-icons";

import { getVenueOwners } from "api/admin";

import { PollMessage, BaseMessageToDisplay, Vote } from "types/chat";

import { WithId } from "utils/id";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";
import Button from "components/atoms/Button";

import { useRoles } from "hooks/useRoles";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import "./ChatPoll.scss";

export interface ChatPollProps {
  pollMessage: WithId<BaseMessageToDisplay<PollMessage>>;
  deletePollMessage: (pollId: string) => void;
  voteInPoll: (votes: Vote[], pollId: string) => void;
}

export const ChatPoll: React.FC<ChatPollProps> = ({
  pollMessage,
  voteInPoll,
  deletePollMessage,
}) => {
  const { userId } = useUser();
  const { userRoles } = useRoles();
  const venueId = useVenueId();
  const [owners, setOwners] = useState<string[]>([]);
  const isAdmin = Boolean(userRoles?.includes("admin"));

  const { id, poll, votes, isMine } = pollMessage;
  const { questions, topic } = poll;

  useEffect(() => {
    async function fetchVenueOwners() {
      if (!venueId) return;
      const owners = await getVenueOwners(venueId);
      setOwners(owners);
    }

    fetchVenueOwners();
  }, [venueId]);

  const canBeDeleted: boolean = useMemo(() => {
    if (!userId || !owners.length) return false;

    return isAdmin && owners.includes(userId);
  }, [isAdmin, userId, owners]);

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
        deleteMessage={() => deletePollMessage(id)}
      />
    </div>
  );
};
