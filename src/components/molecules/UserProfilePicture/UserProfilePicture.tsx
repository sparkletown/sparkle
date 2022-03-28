import React, { useCallback } from "react";
import classNames from "classnames";

import { UserId } from "types/id";
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
  reactionPosition = "right",
  showStatus = false,
  isVideoEnabled = true,
  size,
  containerClassName,
}) => {
  const userId = user?.id;

  const { openUserProfileModal } = useProfileModalControls();

  const openProfileModal = useCallback(
    () => openUserProfileModal(user?.id as UserId),
    [openUserProfileModal, user?.id]
  );

  // @debt useImage tries to load the images twice, which is made worse by us not caching images retrieved from firebase,
  //  it's only used to handle the edgecase of showing a default when images are missing. Can we live without it?
  // const { loadedImageUrl: pictureUrl } = useImage({
  //   src: avatarUrl({ user, miniAvatars }),
  //   fallbackSrc: () => randomAvatarUrl(user.id),
  // });

  // @debt For some reason when using this the image seems to be re-fetched every time the component is re-rendered
  //   even though it seemed to be working fine earlier)
  // const pictureUrl = getAvatarUrl({ user, miniAvatars });
  //

  const containerClasses = classNames("UserProfilePicture", {
    "UserProfilePicture--only-icon": !isVideoEnabled,
    containerClassName,
  });

  return (
    <div
      data-bem="UserProfilePicture"
      className={containerClasses}
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
