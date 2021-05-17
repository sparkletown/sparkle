import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoll } from "@fortawesome/free-solid-svg-icons";

import { formatHourAndMinute } from "utils/time";

import { PollData, PollQuestion } from "types/chat";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserAvatar } from "components/atoms/UserAvatar";
import Button from "components/atoms/Button";

import "./ChatPoll.scss";

export interface ChatPollProps {
  pollData: PollData;
  deletePoll: (pollId: string) => void;
  voteInPoll: (question: PollQuestion) => void;
}

export const ChatPoll: React.FC<ChatPollProps> = ({
  pollData,
  voteInPoll,
  deletePoll,
}) => {
  const {
    poll,
    ts_utc,
    isMine,
    author,
    canBeDeleted,
    votes,
    pollId,
  } = pollData;
  const { questions, topic } = poll;

  const { openUserProfileModal } = useProfileModalControls();

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

  const openAuthorProfile = useCallback(() => {
    openUserProfileModal(author);
  }, [openUserProfileModal, author]);

  return (
    <div className={containerStyles}>
      <div className="ChatPoll__wrapper">
        <FontAwesomeIcon className="ChatPoll__icon" icon={faPoll} size="lg" />
        <div className="ChatPoll__topic">{topic}</div>
        {renderQuestions}
        <div className="ChatPoll__details">
          <p className="ChatPoll__votes">{`${votes} votes`}</p>
          {canBeDeleted && (
            <>
              -
              <button
                onClick={() => deletePoll(pollId)}
                className="ChatPoll__delete-button"
              >
                Delete Poll
              </button>
            </>
          )}
        </div>
      </div>

      <div className="ChatPoll__info" onClick={openAuthorProfile}>
        <UserAvatar user={author} />
        <span className="ChatPoll__author">{author.partyName}</span>
        <span className="ChatPoll__time">{formatHourAndMinute(ts_utc)}</span>
      </div>
    </div>
  );
};
