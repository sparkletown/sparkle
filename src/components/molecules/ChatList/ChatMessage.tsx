import React, { FC, useCallback } from "react";

import {
  DEFAULT_PARTY_NAME,
  DEFAULT_PROFILE_IMAGE,
  PROFILE_IMAGE_SIZE,
} from "settings";

import { WithId } from "utils/id";
import { formatUtcSeconds } from "utils/time";
import { getLinkFromText } from "utils/getLinkFromText";

import { useUser } from "hooks/useUser";

import { User } from "types/User";

import {
  PrivateChatMessage,
  RestrictedChatMessage,
} from "components/context/ChatContext";

interface ChatMessageProps {
  message: WithId<RestrictedChatMessage | PrivateChatMessage>;
  usersById: Record<string, User>;
  allowDelete: boolean;
  onAvatarClick: (
    message: WithId<RestrictedChatMessage | PrivateChatMessage>
  ) => void;
  onDeleteClick: (
    message: WithId<RestrictedChatMessage | PrivateChatMessage>
  ) => void;
}

export const ChatMessage: FC<ChatMessageProps> = ({
  message,
  usersById,
  allowDelete,
  onAvatarClick,
  onDeleteClick,
}) => {
  const { user } = useUser();

  const sender = { ...usersById[message.from], id: message.from };
  const isMe = sender.id === user?.uid;
  const profileImage = sender.anonMode
    ? DEFAULT_PROFILE_IMAGE
    : sender.pictureUrl;
  const profileName = sender.anonMode ? DEFAULT_PARTY_NAME : sender.partyName;

  const showMessage = useCallback(() => {
    onAvatarClick(message);
  }, [message, onAvatarClick]);

  const deleteMessage = useCallback(() => {
    onDeleteClick(message);
  }, [message, onDeleteClick]);

  return message.from in usersById ? (
    <div
      className={`message chat-message ${isMe ? "chat-message_own" : ""}`}
      key={`${message.from}-${message.ts_utc}`}
    >
      <div className="chat-message-bubble">{getLinkFromText(message.text)}</div>
      <div className="chat-message-author">
        <img
          onClick={showMessage}
          key={`${message.from}-messaging-the-band`}
          className="chat-message-avatar"
          src={profileImage}
          title={profileName}
          alt={`${profileName} profile`}
          width={PROFILE_IMAGE_SIZE}
          height={PROFILE_IMAGE_SIZE}
        />
        <div className="chat-message-pseudo">
          {profileName}{" "}
          <span className="timestamp">{formatUtcSeconds(message.ts_utc)}</span>
        </div>
        {allowDelete && (
          <div className="chat-message-delete" onClick={deleteMessage}></div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};
