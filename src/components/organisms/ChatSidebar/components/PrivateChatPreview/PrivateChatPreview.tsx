import React from "react";
import classNames from "classnames";
import { formatDistanceToNow } from "date-fns";

import { PreviewChatMessage } from "types/chat";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./PrivateChatPreview.scss";

export interface PrivateChatPreviewProps {
  message: PreviewChatMessage;
  onClick?: () => void;
}

export const PrivateChatPreview: React.FC<PrivateChatPreviewProps> = ({
  message,
  onClick,
}) => {
  const isMine = useIsCurrentUser(message.from.id);

  const { isRead, counterPartyUser, text, ts_utc } = message;

  const timestamp = ts_utc.toMillis();

  const containerClasses = classNames("chat-preview", {
    "chat-preview--highlight": !isRead && !isMine,
  });

  return (
    <div className={containerClasses} onClick={onClick}>
      <UserAvatar user={counterPartyUser} showStatus size="small" />
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
