import React, { useCallback } from "react";
import classNames from "classnames";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserReactions } from "components/molecules/UserReactions";

import { UserAvatar } from "components/atoms/UserAvatar";

import { UserAvatarSize } from "../../atoms/UserAvatar/UserAvatar";

import "./UserProfilePicture.scss";

export interface UserProfilePictureProp extends ContainerClassName {
  user?: WithId<User>;
  isAudioEffectDisabled?: boolean;
  reactionPosition?: "left" | "right";
  showStatus?: boolean;
  /**
   * @deprecated Note: This feature is currently disabled.
   */
  miniAvatars?: boolean;
  size?: UserAvatarSize;
  isVideoEnabled?: boolean;
}

export const UserProfilePicture: React.FC<UserProfilePictureProp> = ({
  user,
  isAudioEffectDisabled = true,
  containerClassName,
  reactionPosition = "right",
  showStatus = false,
  isVideoEnabled = true,
  size,
}) => {
  const userId = user?.id;

  const { openUserProfileModal } = useProfileModalControls();

  const openProfileModal = useCallback(() => openUserProfileModal(user?.id), [
    openUserProfileModal,
    user?.id,
  ]);

  const containerClasses = classNames(
    "UserProfilePicture",
    { "UserProfilePicture--only-icon": !isVideoEnabled },
    containerClassName
  );

  return (
    <div className={containerClasses} onClick={openProfileModal}>
      <UserAvatar
        user={user}
        containerClassName="UserProfilePicture__avatar"
        showStatus={showStatus}
        size={size}
      />

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
