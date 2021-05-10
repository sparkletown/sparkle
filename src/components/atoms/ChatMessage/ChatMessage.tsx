import React from "react";
import classNames from "classnames";

import { MessageToDisplay } from "types/chat";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";

import "./ChatMessage.scss";

export interface ChatProps {
  message: MessageToDisplay;
  deleteMessage: () => void;
}

export const ChatMessage: React.FC<ChatProps> = ({
  message,
  deleteMessage,
}) => {
  const { text, isMine } = message;

  const containerStyles = classNames("chat-message", {
    "chat-message--me": isMine,
  });

  return (
    <div className={containerStyles}>
      <div className="chat-message__text">{text}</div>
      <ChatMessageInfo
        message={message}
        isReversed={isMine}
        deleteMessage={deleteMessage}
      />
    </div>
  );
};
