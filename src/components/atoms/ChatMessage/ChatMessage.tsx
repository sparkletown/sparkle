import React from "react";
import classNames from "classnames";
import dayjs from "dayjs";

import { MessageToDisplay } from "types/chat";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./ChatMessage.scss";

type ChatProps = {
  onAuthorClick: () => void;
};

export const ChatMessage: React.FC<MessageToDisplay & ChatProps> = ({
  text,
  timestamp,
  isMine,
  author,
  onAuthorClick,
}) => {
  const containerStyles = classNames("chat-message-container", {
    "chat-message-container--isme": isMine,
  });

  const textStyles = classNames("chat-message-text", {
    "chat-message-text--isme": isMine,
  });

  const messageInfoStyles = classNames("chat-message-info", {
    "chat-message-info--isme": isMine,
  });

  return (
    <div className={containerStyles}>
      <div className={textStyles}>{text}</div>
      <div className={messageInfoStyles}>
        <UserAvatar onClick={onAuthorClick} avatarSrc={author.pictureUrl} />
        <p onClick={onAuthorClick} className="chat-message-author-name">
          {author.partyName}
        </p>
        <p className="chat-message-time">{dayjs(timestamp).format("h:mm A")}</p>
      </div>
    </div>
  );
};
