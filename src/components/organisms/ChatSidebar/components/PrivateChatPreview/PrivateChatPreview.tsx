import React from "react";
import { formatDistanceToNow } from "date-fns";
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

  const containerStyles = classNames("chat-preview", {
    "chat-preview--highlight": !isRead && !isMine,
  });

  return (
    <div className={containerStyles} onClick={onClick}>
      <UserAvatar avatarSrc={counterPartyUser.pictureUrl} isOnline={isOnline} />
      <div className="chat-preview__content">
        <div className="chat-preview__username">
          {counterPartyUser.partyName}
        </div>
        <div className="chat-preview__text">{text}</div>
      </div>
      <div className="chat-preview__time">
        {formatDistanceToNow(timestamp, { addSuffix: true })}
      </div>
    </div>
  );
};
