import React from "react";
import classNames from "classnames";
import dayjs from "dayjs";

import { DisplayMessage } from "hooks/useVenueChat";

import "./ChatMessage.scss";

type ChatProps = {};

export const ChatMessage: React.FC<DisplayMessage> = ({
  text,
  timestamp,
  isMine,
  author,
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
        <img className="chat-message-author-pic" src={author.pictureUrl} />
        <p className="chat-message-author-name">{author.partyName}</p>
        <p className="chat-message-time">{dayjs(timestamp).format("h:MM A")}</p>
      </div>
    </div>
  );
};
