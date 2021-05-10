import React, { useCallback } from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { MessageToDisplay } from "types/chat";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserAvatar } from "components/atoms/UserAvatar";
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
