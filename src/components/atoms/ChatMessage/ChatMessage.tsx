import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";

import { MessageToDisplay } from "types/chat";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";

import "./ChatMessage.scss";

export interface ChatProps {
  message: WithId<MessageToDisplay>;
  deleteMessage: (messageId: string) => void;
  setChosenThread: (message: WithId<MessageToDisplay>) => void;
}

export const ChatMessage: React.FC<ChatProps> = ({
  message,
  deleteMessage,
  setChosenThread,
}) => {
  const { text, isMine, replies, id } = message;

  const onMessageDelete = useCallback(() => deleteMessage(id), [
    deleteMessage,
    id,
  ]);

  const onReplyClick = useCallback(() => setChosenThread(message), [
    setChosenThread,
    message,
  ]);

  const { isShown, toggle } = useShowHide();

  const containerStyles = classNames("ChatMessage", {
    "ChatMessage--me": isMine,
  });

  const renderedReplies = useMemo(
    () =>
      replies?.map((reply) => (
        <div key={reply.id} className="ChatMessage__reply">
          {reply.text}
          <ChatMessageInfo
            message={reply}
            deleteMessage={() => deleteMessage(reply.id)}
          />
        </div>
      )),
    [replies, deleteMessage]
  );

  const hasReplies = renderedReplies !== undefined;

  const repliesCount = renderedReplies && renderedReplies.length;

  const hasMultipleReplies = repliesCount && repliesCount > 1;

  const replyText = hasMultipleReplies ? "replies" : "reply";

  return (
    <div className={containerStyles}>
      <div className="ChatMessage__body">
        <div className="ChatMessage__main">
          <div className="ChatMessage__text">{text}</div>

          <div className="ChatMessage__reply-icon">
            <FontAwesomeIcon icon={faReply} size="sm" onClick={onReplyClick} />
          </div>
          {hasReplies && (
            <div className="ChatMessage__simple-button" onClick={toggle}>
              {!isShown ? `${repliesCount} ${replyText}` : `hide ${replyText}`}
            </div>
          )}
        </div>

        {isShown && (
          <div className="ChatMessage__replies">{renderedReplies}</div>
        )}
      </div>
      <ChatMessageInfo
        message={message}
        isReversed={isMine}
        deleteMessage={onMessageDelete}
      />
    </div>
  );
};
