import React, { useCallback } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { OldChatMessage } from "types/chat";

import { formatTimeLocalised } from "utils/time";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./ChatMessageInfo.scss";

const deleteIconClass = "ChatMessageInfo__delete-icon";

export interface ChatMessageInfoProps {
  message: OldChatMessage;
  deleteMessage?: () => Promise<void>;
  reversed?: boolean;
}

export const ChatMessageInfo: React.FC<ChatMessageInfoProps> = ({
  message,
  deleteMessage,
  reversed: isReversed = false,
}) => {
  const { timestamp, fromUser } = message;
  const { openUserProfileModal } = useProfileModalControls();

  const timestampMillis = timestamp.toMillis();

  const openAuthorProfile = useCallback(
    (event) => {
      if (event.target.closest(`.${deleteIconClass}`)) return;

      openUserProfileModal(fromUser.id);
    },
    [openUserProfileModal, fromUser.id]
  );

  const containerClasses = classNames("ChatMessageInfo", {
    "ChatMessageInfo--reverse": isReversed,
  });

  return (
    <div className={containerClasses} onClick={openAuthorProfile}>
      <UserAvatar user={fromUser} showStatus />
      <span className="ChatMessageInfo__author">{fromUser.partyName}</span>
      <span className="ChatMessageInfo__time">
        {formatTimeLocalised(timestampMillis)}
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
