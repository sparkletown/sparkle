import React, { useState, useCallback, useEffect, useMemo } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoll } from "@fortawesome/free-solid-svg-icons";

import { getVenueOwners } from "api/admin";

import {
  PollMessage,
  BaseMessageToDisplay,
  VoteInPoll,
  PollQuestion,
  DeleteMessage,
} from "types/chat";

import { WithId } from "utils/id";

import { useRoles } from "hooks/useRoles";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";
import Button from "components/atoms/Button";

import "./ChatPoll.scss";

export interface ChatPollProps {
  pollMessage: WithId<BaseMessageToDisplay<PollMessage>>;
  deletePollMessage: DeleteMessage;
  voteInPoll: (data: VoteInPoll) => void;
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

  const handleVote = useCallback(
    (question) =>
      voteInPoll({
        questionId: question.id,
        pollId: id,
      }),
    [id, voteInPoll]
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

  const calculateShare = useCallback(
    (item: PollQuestion) =>
      votes.length
        ? Math.floor(
            (votes.filter(({ questionId }) => questionId === item.id).length /
              votes.length) *
              100
          )
        : 0,
    [votes]
  );

  const renderResults = useMemo(() => {
    const sortedQuestions = questions
      .map((item) => ({
        ...item,
        share: calculateShare(item),
      }))
      .sort((a, b) => b.share - a.share);

    return sortedQuestions.map((question) => (
      <div key={question.name} className="ChatPoll__text">
        <div
          className="ChatPoll__text-background"
          style={{ width: `${question.share}%` }}
        />
        <span className="ChatPoll__text-count">{question.share}%</span>
        {question.name}
      </div>
    ));
  }, [questions, calculateShare]);

  const deleteThisPollMessage = useCallback(() => deletePollMessage(id), [
    id,
    deletePollMessage,
  ]);

  return (
    <div className={containerStyles}>
      <div className="ChatPoll__bulb">
        <FontAwesomeIcon className="ChatPoll__icon" icon={faPoll} size="lg" />
        <div className="ChatPoll__topic">{topic}</div>
        <div>{isMine || isVoted ? renderResults : renderQuestions}</div>
        <div className="ChatPoll__details">
          <span>{`${votes.length} votes`}</span>
        </div>
      </div>

      <ChatMessageInfo
        message={message}
        reversed={isMine}
        deleteMessage={deleteThisPollMessage}
      />
    </div>
  );
};
