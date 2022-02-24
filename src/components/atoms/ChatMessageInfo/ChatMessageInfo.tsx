import React, { useCallback, useMemo } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { BaseChatMessage } from "types/chat";

import { WithId } from "utils/id";
import { formatTimeLocalised } from "utils/time";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserAvatar } from "components/atoms/UserAvatar";
import {
  useChatboxDeleteChatMessage,
  useChatboxDeleteThreadMessage,
} from "components/molecules/Chatbox/components/context/ChatboxContext";

import "./ChatMessageInfo.scss";

const deleteIconClass = "ChatMessageInfo__delete-icon";

export interface ChatMessageInfoProps {
  threadId?: string;
  message: WithId<BaseChatMessage>;
  reversed?: boolean;
}

export const ChatMessageInfo: React.FC<ChatMessageInfoProps> = ({
  message,
  threadId,
  reversed: isReversed = false,
}) => {
  const { timestamp, fromUser } = message;
  const { openUserProfileModal } = useProfileModalControls();

  const deleteThreadReply = useChatboxDeleteThreadMessage();
  const deleteChatMessage = useChatboxDeleteChatMessage();
  const deleteMessage = useMemo(() => {
    if (threadId) {
      if (deleteThreadReply)
        return () => deleteThreadReply({ threadId, messageId: message.id });
    } else {
      if (deleteChatMessage)
        return () => deleteChatMessage({ messageId: message.id });
    }
    return null;
  }, [deleteChatMessage, deleteThreadReply, message.id, threadId]);

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
