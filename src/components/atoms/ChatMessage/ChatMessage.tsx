import React, { useCallback } from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { MessageToDisplay } from "types/chat";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./ChatMessage.scss";

export interface ChatProps {
  message: MessageToDisplay;
  deleteMessage: () => void;
}

export const ChatMessage: React.FC<ChatProps> = ({
  message,
  deleteMessage,
}) => {
  const { text, ts_utc, isMine, author, canBeDeleted } = message;
  const { openUserProfileModal } = useProfileModalControls();

  const timestamp = ts_utc.toMillis();

  const containerStyles = classNames("chat-message", {
    "chat-message--me": isMine,
  });

  const openAuthorProfile = useCallback(() => {
    openUserProfileModal(author);
  }, [openUserProfileModal, author]);

  return (
    <div className={containerStyles}>
      <div className="chat-message__text">{text}</div>
      <div className="chat-message__info" onClick={openAuthorProfile}>
        <UserAvatar user={author} isShowStatus />
        <span className="chat-message__author">{author.partyName}</span>
        <span className="chat-message__time">
          {dayjs(timestamp).format("h:mm A")}
        </span>
        {canBeDeleted && (
          <FontAwesomeIcon
            onClick={deleteMessage}
            icon={faTrash}
            className="chat-message__delete-icon"
            size="sm"
          />
        )}
      </div>
    </div>
  );
};
