import React, { useCallback, useMemo } from "react";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import {
  BaseChatMessage,
  DeleteChatMessage,
  DeleteMessageProps,
  DeleteThreadMessageProps,
  MessageToDisplay,
} from "types/chat";

import { WithId } from "utils/id";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useShowHide } from "hooks/useShowHide";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";
import { TextButton } from "components/atoms/TextButton";

import "./ChatMessage.scss";

export interface ChatProps {
  message: WithId<MessageToDisplay>;
  thread: WithId<BaseChatMessage>[];
  deleteMessage?: DeleteChatMessage<DeleteMessageProps>;
  deleteThreadReply?: DeleteChatMessage<DeleteThreadMessageProps>;
  selectThisThread: () => void;
}

export const ChatMessage: React.FC<ChatProps> = ({
  message,
  thread,
  deleteMessage,
  deleteThreadReply,
  selectThisThread,
}) => {
  const isMine = useIsCurrentUser(message.fromUser.id);
  const { text, id: messageId, isQuestion } = message;

  const deleteThisMessage = useCallback(
    async () => deleteMessage?.({ messageId: messageId }),
    [deleteMessage, messageId]
  );

  const { isShown: isRepliesShown, toggle: toggleReplies } = useShowHide();

  const containerStyles = classNames("ChatMessage", {
    "ChatMessage--me": isMine,
    "ChatMessage--question": isQuestion,
  });

  const renderedReplies = useMemo(
    () =>
      thread?.map((reply) => {
        const deleteReplyMessage = async () =>
          deleteThreadReply?.({ threadId: messageId, messageId: reply.id });

        return (
          <div key={reply.id} className="ChatMessage__reply">
            <RenderMarkdown text={reply.text} allowHeadings={false} />
            <ChatMessageInfo
              message={reply}
              deleteMessage={deleteThreadReply && deleteReplyMessage}
            />
          </div>
        );
      }),
    [thread, deleteThreadReply, messageId]
  );

  const repliesCount = message.repliesCount;

  const hasReplies = repliesCount !== 0;

  const hasMultipleReplies = repliesCount > 1;

  const replyText = hasMultipleReplies ? "replies" : "reply";

  const replyButtonText = !isRepliesShown
    ? `${repliesCount} ${replyText}`
    : `hide ${replyText}`;

  return (
    <div className={containerStyles}>
      <div className="ChatMessage__bulb">
        <div className="ChatMessage__text-content">
          <div className="ChatMessage__text">
            <RenderMarkdown text={text} allowHeadings={false} />
          </div>

          <button
            aria-label={replyButtonText}
            className="ChatMessage__reply-icon"
            onClick={selectThisThread}
          >
            <FontAwesomeIcon icon={faReply} size="sm" />
          </button>
          {hasReplies && (
            <TextButton
              containerClassName="ChatMessage__show-replies-button"
              onClick={toggleReplies}
              label={replyButtonText}
            />
          )}
        </div>

        <div className="ChatMessage__replies-content">
          {isRepliesShown && (
            <div className="ChatMessage__replies">{renderedReplies}</div>
          )}
        </div>
      </div>
      <ChatMessageInfo
        message={message}
        reversed={isMine}
        deleteMessage={deleteMessage && deleteThisMessage}
      />
    </div>
  );
};
