import React from "react";
import classNames from "classnames";

import { MessageToDisplay } from "types/chat";

import { WithId } from "utils/id";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";

import { UserAvatar } from "../UserAvatar";

import styles from "./ChatMessage.module.scss";
export interface ChatMessageProps {
  message: WithId<MessageToDisplay>;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isMine = useIsCurrentUser(message.fromUser.id);
  const { text, fromUser } = message;

  const rowClassnames = classNames(styles.chatMessageRow, {
    [styles.chatMessageRow__isMine]: isMine,
  });

  return (
    <div className={rowClassnames}>
      <div className={styles.avatarSpacer} />
      <UserAvatar
        containerClassName={styles.avatarContainer}
        user={fromUser}
        size="medium"
      />

      <div className={styles.chatMessageBody}>
        <ChatMessageInfo message={message} />
        <div>
          <div>
            <RenderMarkdown text={text} allowHeadings={false} />
          </div>
        </div>
      </div>
    </div>
  );
};
