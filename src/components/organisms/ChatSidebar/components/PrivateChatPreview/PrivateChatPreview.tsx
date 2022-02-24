import React from "react";
import classNames from "classnames";
import { formatDistanceToNow } from "date-fns";

import { PreviewChatMessage } from "types/chat";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";

import { UserAvatar } from "components/atoms/UserAvatar";

import styles from "./PrivateChatPreview.module.scss";

export interface PrivateChatPreviewProps {
  message: PreviewChatMessage;
  onClick?: () => void;
}

export const PrivateChatPreview: React.FC<PrivateChatPreviewProps> = ({
  message,
  onClick,
}) => {
  const isMine = useIsCurrentUser(message.fromUser.id);

  const { isRead, counterPartyUser, text, timestamp } = message;

  const timestampMillis = timestamp.toMillis();

  const containerClasses = classNames(styles.privateChatPreviewContainer, {
    [styles.privateChatPreviewContainer__highlight]: !isRead && !isMine,
  });

  return (
    <div className={containerClasses} onClick={onClick}>
      <UserAvatar
        containerClassName={styles.avatarContainer}
        user={counterPartyUser}
      />
      <div className={styles.chatBodyContainer}>
        <div className={styles.chatPreviewInfo}>
          <div className={styles.chatPreviewInfoUsername}>
            {counterPartyUser.partyName}
          </div>
          <div className={styles.chatPreviewInfoTime}>
            {formatDistanceToNow(timestampMillis, { addSuffix: true })}
          </div>
        </div>
        <div className={styles.chatPreviewText}>{text}</div>
      </div>
    </div>
  );
};
