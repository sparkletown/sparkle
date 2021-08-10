import React, { useCallback } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { BaseMessageToDisplay } from "types/chat";

import { formatTimeLocalised } from "utils/time";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./ChatMessageInfo.scss";

const deleteIconClass = "ChatMessageInfo__delete-icon";

export interface ChatMessageInfoProps {
  message: BaseMessageToDisplay;
  deleteMessage: () => void;
  reversed?: boolean;
}

export const ChatMessageInfo: React.FC<ChatMessageInfoProps> = ({
  message,
  deleteMessage,
  reversed: isReversed = false,
}) => {
  const { ts_utc, author, canBeDeleted } = message;
  const { openUserProfileModal } = useProfileModalControls();

  const timestamp = ts_utc.toMillis();

  const openAuthorProfile = useCallback(
    (event) => {
      if (event.target.closest(`.${deleteIconClass}`)) return;

      openUserProfileModal(author);
    },
    [openUserProfileModal, author]
  );

  const containerClasses = classNames("ChatMessageInfo", {
    "ChatMessageInfo--reverse": isReversed,
  });

  return (
    <div className={containerClasses} onClick={openAuthorProfile}>
      <UserAvatar user={author} showStatus />
      <span className="ChatMessageInfo__author">{author.partyName}</span>
      <span className="ChatMessageInfo__time">
        {formatTimeLocalised(timestamp)}
      </span>
      {canBeDeleted && (
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
