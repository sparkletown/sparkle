import React from "react";
import dayjs from "dayjs";
import classNames from "classnames";

import { PreviewChatMessageToDisplay } from "types/chat";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./PrivateChatPreview.scss";

export interface PrivateChatPreviewProps {
  message: PreviewChatMessageToDisplay;
  isOnline: boolean;
  onClick: () => void;
}

export const PrivateChatPreview: React.FC<PrivateChatPreviewProps> = ({
  message,
  isOnline,
  onClick,
}) => {
  const { isRead, isMine, counterPartyUser, text, ts_utc } = message;

  const timestamp = ts_utc.toMillis();

  const usernameStyles = classNames("private-chat-preview-username", {
    "private-chat-preview-username--highlight": !isRead && !isMine,
  });

  const messageStyles = classNames("private-chat-preview-text", {
    "private-chat-preview-text--highlight": !isRead && !isMine,
  });

  const timeStyles = classNames("private-chat-preview-time", {
    "private-chat-preview-time--highlight": !isRead && !isMine,
  });

  return (
    <div className="private-chat-preview-container" onClick={onClick}>
      <UserAvatar avatarSrc={counterPartyUser.pictureUrl} isOnline={isOnline} />
      <div className="private-chat-preview-content">
        <div className={usernameStyles}>{counterPartyUser.partyName}</div>
        <div className={messageStyles}>{text}</div>
      </div>
      <div className={timeStyles}>{dayjs(timestamp).fromNow()}</div>
    </div>
  );
};
