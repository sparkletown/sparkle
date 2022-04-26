import React, { useCallback, useMemo } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { BaseChatMessage } from "types/chat";
import { UserId } from "types/id";

import { WithId } from "utils/id";
import { formatTimeLocalised } from "utils/time";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useProfileModalControls } from "hooks/useProfileModalControls";

import {
  useChatboxDeleteChatMessage,
  useChatboxDeleteThreadMessage,
} from "components/molecules/Chatbox/components/context/ChatboxContext";

import styles from "./ChatMessageInfo.module.scss";

export interface ChatMessageInfoProps {
  threadId?: string;
  message: WithId<BaseChatMessage>;
}

export const ChatMessageInfo: React.FC<ChatMessageInfoProps> = ({
  message,
  threadId,
}) => {
  const isMine = useIsCurrentUser(message.fromUser.id);
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
      openUserProfileModal(fromUser.id as UserId);
    },
    [openUserProfileModal, fromUser.id]
  );

  const containerClassnames = classNames(styles.chatMessageInfo, {
    [styles.isMine]: isMine,
  });

  return (
    <div
      data-bem="ChatMessageInfo"
      onClick={openAuthorProfile}
      className={containerClassnames}
    >
      <h4 className={styles.authorName}>{fromUser.partyName}</h4>
      &nbsp;
      <time className={styles.messageTime}>
        {formatTimeLocalised(timestampMillis)}
      </time>
      {deleteMessage && (
        <FontAwesomeIcon onClick={deleteMessage} icon={faTrash} size="sm" />
      )}
    </div>
  );
};
