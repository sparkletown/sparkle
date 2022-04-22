import React, { useCallback } from "react";

import { UserId } from "types/id";
import { User } from "types/User";

import { WithId } from "utils/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserReactions } from "components/molecules/UserReactions";

import { UserAvatar } from "components/atoms/UserAvatar";

import { UserAvatarSize } from "../../atoms/UserAvatar/UserAvatar";

import "./UserProfilePicture.scss";

interface UserProfilePictureProp {
  user?: WithId<User>;
  isAudioEffectDisabled?: boolean;
  reactionPosition?: "left" | "right";
  showStatus?: boolean;
  size?: UserAvatarSize;
  isVideoEnabled?: boolean;
}

export const UserProfilePicture: React.FC<UserProfilePictureProp> = ({
  user,
  isAudioEffectDisabled = true,
  reactionPosition = "right",
  showStatus = false,
  isVideoEnabled = true,
  size,
}) => {
  const userId = user?.id;

  const { openUserProfileModal } = useProfileModalControls();

  const openProfileModal = useCallback(
    () => openUserProfileModal(user?.id as UserId),
    [openUserProfileModal, user?.id]
  );

  return (
    <div
      data-bem="UserProfilePicture"
      className="UserProfilePicture"
      onClick={openProfileModal}
    >
      <UserAvatar user={user} showStatus={showStatus} size={size} />

      {userId && (
        <UserReactions
          userId={userId}
          isMuted={isAudioEffectDisabled}
          reactionPosition={reactionPosition}
        />
      )}
    </div>
  );
};
