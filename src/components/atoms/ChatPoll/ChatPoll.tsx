import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoll } from "@fortawesome/free-solid-svg-icons";

import { WithId } from "utils/id";
import { formatHourAndMinute } from "utils/time";

import { User } from "types/User";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { PollValues, PollQuestion } from "components/molecules/PollBox/PollBox";

import { UserAvatar } from "components/atoms/UserAvatar";
import Button from "components/atoms/Button";

import "./ChatPoll.scss";

export interface ChatPollProps {
  pollData: {
    poll: PollValues;
    ts_utc: number;
    isMine: boolean;
    author: WithId<User>;
    canBeDeleted: boolean;
    votes: number;
  };
  deletePoll?: () => void;
}

export const ChatPoll: React.FC<ChatPollProps> = ({ pollData, deletePoll }) => {
  const { poll, ts_utc, isMine, author, canBeDeleted, votes } = pollData;
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
          // TODO: finish button for voting
          <Button onClick={console.log}>Send message</Button>
          // <button
          //   key={question.name}
          //   className="ChatPoll__question"
          //   onClick={() => console.log(question)}
          // >
          //   {question.name}
          // </button>
        )
      ),
    [questions, isMine]
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
              <button onClick={deletePoll} className="ChatPoll__delete-button">
                Delete Poll
              </button>
            </>
          )}
        </div>
      </div>

      <div className="ChatPoll__info" onClick={openAuthorProfile}>
        <UserAvatar user={author} />
        <span className="ChatPoll__author">{author.partyName}</span>
        <span className="ChatPoll__time">
          {formatHourAndMinute(ts_utc, true)}
        </span>
      </div>
    </div>
  );
};
