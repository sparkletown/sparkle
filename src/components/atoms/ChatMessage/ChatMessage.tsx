import React from "react";
import classNames from "classnames";

import { MessageToDisplay } from "types/chat";

import { WithId } from "utils/id";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";

import { UserAvatar } from "../UserAvatar";

import CN from "./ChatMessage.module.scss";
export interface ChatMessageProps {
  message: WithId<MessageToDisplay>;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isMine = useIsCurrentUser(message.fromUser.id);
  const { text, fromUser } = message;

  const rowClassnames = classNames(CN.chatMessageRow, {
    [CN.chatMessageRow__isMine]: isMine,
  });

  return (
    <div className={rowClassnames}>
      <div className={CN.avatarSpacer} />
      <UserAvatar
        containerClassName={CN.avatarContainer}
        user={fromUser}
        size="medium"
      />

      <div className={CN.chatMessageBody}>
        <ChatMessageInfo message={message} />
        <RenderMarkdown text={text} allowHeadings={false} />
      </div>
    </div>
  );
};
