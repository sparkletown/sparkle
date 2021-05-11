import React, { useCallback } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";

import { MessageToDisplay } from "types/chat";

import { WithId } from "utils/id";

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

  const containerStyles = classNames("chat-message", {
    "chat-message--me": isMine,
  });

  return (
    <div className={containerStyles}>
      <div className="chat-message__text">
        {text}
        <FontAwesomeIcon icon={faReply} size="sm" onClick={onReplyClick} />

        {replies && replies}
      </div>
      <ChatMessageInfo
        message={message}
        isReversed={isMine}
        deleteMessage={onMessageDelete}
      />
    </div>
  );
};
