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
import { PrivateChatMessage, RestrictedChatMessage } from "store/actions/Chat";

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
  showSenderImage?: boolean;
}

export const ChatMessage: FC<ChatMessageProps> = ({
  message,
  usersById,
  allowDelete,
  onAvatarClick,
  onDeleteClick,
  showSenderImage = true,
}) => {
  const { user, profile } = useUser();

  const showMessage = useCallback(() => {
    onAvatarClick(message);
  }, [message, onAvatarClick]);

  const deleteMessage = useCallback(() => {
    onDeleteClick(message);
  }, [message, onDeleteClick]);

  if (!user || !profile) return null;

  const sender = { ...usersById[message.from], id: message.from };
  const isMe = message.from === user.uid;

  const getProfileImage = (): string => {
    if (isMe) {
      return profile.pictureUrl || DEFAULT_PROFILE_IMAGE;
    }

    if (sender.anonMode) {
      return DEFAULT_PROFILE_IMAGE;
    }

    return sender.pictureUrl || DEFAULT_PROFILE_IMAGE;
  };

  const getProfileName = (): string => {
    if (isMe) {
      return profile.partyName || DEFAULT_PROFILE_IMAGE;
    }

    if (sender.anonMode) {
      return DEFAULT_PARTY_NAME;
    }

    return sender.partyName || DEFAULT_PROFILE_IMAGE;
  };

  return (
    <div
      className={`message chat-message ${isMe ? "chat-message_own" : ""}`}
      key={`${message.from}-${message.ts_utc}`}
    >
      <div className="chat-message-bubble">{getLinkFromText(message.text)}</div>
      <div className="chat-message-author">
        {showSenderImage && (
          <>
            <img
              onClick={showMessage}
              key={`${message.from}-messaging-the-band`}
              className="chat-message-avatar"
              src={getProfileImage()}
              title={getProfileName()}
              alt={`${getProfileName()} profile`}
              width={PROFILE_IMAGE_SIZE}
              height={PROFILE_IMAGE_SIZE}
            />
            <div className="chat-message-pseudo">
              {getProfileName()}{" "}
              <span className="timestamp">
                {formatUtcSeconds(message.ts_utc.seconds)}
              </span>
            </div>
          </>
        )}
        {allowDelete && (
          <div className="chat-message-delete" onClick={deleteMessage}></div>
        )}
      </div>
    </div>
  );
};
