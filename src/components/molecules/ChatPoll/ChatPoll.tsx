import React, { useCallback, useMemo } from "react";
import { useAsyncFn } from "react-use";
import { faPoll } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { DeleteMessage, PollMessage, PollQuestion } from "types/chat";

import { WithId } from "utils/id";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useUser } from "hooks/useUser";
import { useVenuePoll } from "hooks/useVenuePoll";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { Loading } from "components/molecules/Loading";

import Button from "components/atoms/Button";
import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";

import "./ChatPoll.scss";

export interface ChatPollProps {
  pollMessage: WithId<PollMessage>;
  deletePollMessage?: DeleteMessage;
  voteInPoll: ReturnType<typeof useVenuePoll>["voteInPoll"];
}

export const ChatPoll: React.FC<ChatPollProps> = ({
  pollMessage,
  voteInPoll,
  deletePollMessage,
}) => {
  const { userId } = useUser();
  const { id, poll, votes } = pollMessage;
  const { questions, topic } = poll;
  const isMine = useIsCurrentUser(pollMessage.fromUser.id);

  const hasVoted = userId
    ? votes.some(({ userId: existingUserId }) => userId === existingUserId)
    : false;

  const message = useMemo(() => ({ ...pollMessage }), [pollMessage]);

  const containerStyles = classNames("ChatPoll", {
    "ChatPoll--me": isMine,
  });

  const [{ loading: isVoting }, handleVote] = useAsyncFn(
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
          <RenderMarkdown
            text={question.name}
            components={{
              p: "span",
            }}
          />
        </Button>
      )),
    [questions, handleVote]
  );

  const calculateVotePercentage = useCallback(
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
        share: calculateVotePercentage(item),
      }))
      .sort((a, b) => b.share - a.share);

    return sortedQuestions.map((question) => (
      <div key={question.name} className="ChatPoll__text">
        <div
          className="ChatPoll__text-background"
          style={{ width: `${question.share}%` }}
        />
        <span className="ChatPoll__text-count">{question.share}%</span>
        <RenderMarkdown
          text={question.name}
          components={{
            p: "span",
          }}
        />
      </div>
    ));
  }, [questions, calculateVotePercentage]);

  const renderPollContent = () => {
    if (isVoting) {
      return <Loading />;
    }

    if (hasVoted || isMine) {
      return renderResults;
    }

    return renderQuestions;
  };

  const deleteThisPollMessage = useCallback(
    async () => deletePollMessage?.(id),
    [id, deletePollMessage]
  );

  return (
    <div className={containerStyles}>
      <div className="ChatPoll__bulb">
        <FontAwesomeIcon className="ChatPoll__icon" icon={faPoll} size="lg" />
        <div className="ChatPoll__topic">
          <RenderMarkdown text={topic} />
        </div>
        {renderPollContent()}

        <div className="ChatPoll__details">
          <span>{`${votes.length} votes`}</span>
        </div>
      </div>

      <ChatMessageInfo
        message={message}
        reversed={isMine}
        deleteMessage={deletePollMessage && deleteThisPollMessage}
      />
    </div>
  );
};
