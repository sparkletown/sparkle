import React, { useCallback } from "react";
import { useToggle } from "react-use";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { MessageToDisplay } from "types/chat";

import { WithId } from "utils/id";

import {
  useChatboxDeleteChatMessage,
  useSelectReplyThread,
} from "hooks/chats/private/ChatboxContext";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { ChatMessageReplies } from "components/atoms/ChatMessage/ChatMessageReplies";
import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";
import { TextButton } from "components/atoms/TextButton";

import "./ChatMessage.scss";

export interface ChatMessageProps {
  message: WithId<MessageToDisplay>;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isMine = useIsCurrentUser(message.fromUser.id);
  const { text, id: messageId, isQuestion } = message;

  const deleteMessage = useChatboxDeleteChatMessage();

  const deleteThisMessage = useCallback(
    async () => deleteMessage?.({ messageId: messageId }),
    [deleteMessage, messageId]
  );

  const selectThisThread = useSelectReplyThread(message);

  const [isRepliesShown, toggleReplies] = useToggle(false);

  const containerStyles = classNames("ChatMessage", {
    "ChatMessage--me": isMine,
    "ChatMessage--question": isQuestion,
  });

  const repliesCount = message.repliesCount ?? 0;

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
          {isRepliesShown && <ChatMessageReplies threadId={messageId} />}
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
