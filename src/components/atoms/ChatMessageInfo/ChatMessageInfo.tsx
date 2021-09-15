import React, { useCallback } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ChatMessage, DeleteMessage } from "types/chat";

import { formatTimeLocalised } from "utils/time";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./ChatMessageInfo.scss";

const deleteIconClass = "ChatMessageInfo__delete-icon";

export interface ChatMessageInfoProps {
  message: ChatMessage;
  deleteMessage?: () => Promise<void>;
  reversed?: boolean;
}

export const ChatMessageInfo: React.FC<ChatMessageInfoProps> = ({
  message,
  deleteMessage,
  reversed: isReversed = false,
}) => {
  const { ts_utc, from } = message;
  const { openUserProfileModal } = useProfileModalControls();

  const timestamp = ts_utc.toMillis();

  const openAuthorProfile = useCallback(
    (event) => {
      if (event.target.closest(`.${deleteIconClass}`)) return;

      openUserProfileModal(from.id);
    },
    [openUserProfileModal, from.id]
  );

  const containerClasses = classNames("ChatMessageInfo", {
    "ChatMessageInfo--reverse": isReversed,
  });

  return (
    <div className={containerClasses} onClick={openAuthorProfile}>
      <UserAvatar user={from} showStatus />
      <span className="ChatMessageInfo__author">{from.partyName}</span>
      <span className="ChatMessageInfo__time">
        {formatTimeLocalised(timestamp)}
      </span>
      {deleteMessage && (
        <FontAwesomeIcon
          onClick={deleteMessage}
          icon={faTrash}
          className={deleteIconClass}
          size="sm"
        />
      )}
    </div>
  );
};
