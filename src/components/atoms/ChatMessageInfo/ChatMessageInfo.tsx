import React, { useCallback, useMemo } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { BaseChatMessage } from "types/chat";
import { UserStatus } from "types/User";

import { WithId } from "utils/id";
import { formatTimeLocalised } from "utils/time";
import { getUserDisplayName } from "utils/user";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useUserAvatar } from "hooks/useUserAvatar";
import { useVenueUserStatuses } from "hooks/useVenueUserStatuses";

import {
  useChatboxDeleteChatMessage,
  useChatboxDeleteThreadMessage,
} from "components/molecules/Chatbox/components/context/ChatboxContext";

import { UserAvatarPresentation } from "../UserAvatar/UserAvatar";

import "./ChatMessageInfo.scss";

const deleteIconClass = "ChatMessageInfo__delete-icon";

export interface ChatMessageInfoProps {
  threadId?: string;
  message: WithId<BaseChatMessage>;
  reversed?: boolean;
}

export interface ChatMessageInfoPureProps {
  reversed?: boolean;
  openAuthorProfile: (event: unknown) => void;
  timestampMillis: number;
  deleteMessage: (() => Promise<void>) | null;
  avatarSrc: string;
  userStatus?: UserStatus;
  userName: string;
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

  const {
    userStatus,
    venueUserStatuses,
    isStatusEnabledForVenue,
  } = useVenueUserStatuses(fromUser);

  //'isStatusEnabledForVenue' checks if the user status is enabled from the venue config.
  //'showStatus' is used to render this conditionally only in some of the screens.
  const hasUserStatus =
    isStatusEnabledForVenue &&
    // @debt until temporarily disable is online functionality
    // isOnline &&
    !!venueUserStatuses.length;

  const avatarSrc = useUserAvatar(fromUser);

  const userName: string = getUserDisplayName(fromUser);

  const args = {
    openAuthorProfile,
    timestampMillis,
    deleteMessage,
    isReversed,
    userName,
    userStatus: hasUserStatus ? userStatus : undefined,
    avatarSrc,
  };

  return <ChatMessageInfoPure {...args} />;
};

export const ChatMessageInfoPure: React.FC<ChatMessageInfoPureProps> = ({
  openAuthorProfile,
  userName,
  userStatus,
  timestampMillis,
  deleteMessage,
  avatarSrc,
  reversed: isReversed = false,
}) => {
  const containerClasses = classNames("ChatMessageInfo", {
    "ChatMessageInfo--reverse": isReversed,
  });

  return (
    <div className={containerClasses} onClick={openAuthorProfile}>
      <span className="ChatMessageInfo__author">{userName}</span>
      <UserAvatarPresentation
        userDisplayName={userName}
        userStatus={userStatus}
        avatarSrc={avatarSrc}
      />
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
