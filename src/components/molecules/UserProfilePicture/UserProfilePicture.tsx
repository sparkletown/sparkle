import React, { useCallback } from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import { WithId } from "utils/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import {
  DEFAULT_PARTY_NAME,
  DEFAULT_PROFILE_IMAGE,
  RANDOM_AVATARS,
} from "settings";

import { User } from "types/User";

import { UserReactions } from "components/molecules/UserReactions";

import "./UserProfilePicture.scss";

const generateRandomAvatarUrl = (id: string) =>
  "/avatars/" +
  RANDOM_AVATARS[Math.floor(id?.charCodeAt(0) % RANDOM_AVATARS.length)];

export interface AvatarUrlProps {
  user: WithId<User>;
  miniAvatars?: boolean;
}

const getAvatarUrl = ({ user, miniAvatars }: AvatarUrlProps): string => {
  const { id: userId, anonMode, pictureUrl } = user;

  if (!userId || anonMode) {
    return DEFAULT_PROFILE_IMAGE;
  }

  if (!miniAvatars && pictureUrl) {
    return pictureUrl;
  }

  // @debt how is this intended to be used? Why doesn't it use the profile image? It seems to be something set on venue config..
  if (miniAvatars) {
    return generateRandomAvatarUrl(userId);
  }

  return DEFAULT_PROFILE_IMAGE;
};

export interface UserProfilePictureProp {
  user: WithId<User>;
  isAudioEffectDisabled?: boolean;
  miniAvatars?: boolean;
  containerClassName?: string;
  avatarClassName?: string;
  reactionPosition?: "left" | "right";
}

export const UserProfilePicture: React.FC<UserProfilePictureProp> = ({
  isAudioEffectDisabled = true,
  miniAvatars = false,
  containerClassName,
  avatarClassName,
  reactionPosition = "right",
  user,
}) => {
  const { openUserProfileModal } = useProfileModalControls();

  const openProfileModal = useCallback(() => openUserProfileModal(user), [
    openUserProfileModal,
    user,
  ]);

  const pictureUrl = getAvatarUrl({ user, miniAvatars });
  // @debt useImage tries to load the images twice, which is made worse by us not caching images retrieved from firebase,
  //  it's only used to handle the edgecase of showing a default when images are missing. Can we live without it?
  // const { loadedImageUrl: pictureUrl } = useImage({
  //   src: avatarUrl({ user, miniAvatars }),
  //   fallbackSrc: () => randomAvatarUrl(user.id),
  // });

  const containerClasses = classNames("UserProfilePicture", containerClassName);

  const avatarVars = useCss({
    "--user-profile-picture-avatar-url": pictureUrl
      ? `url(${pictureUrl})`
      : `url(${DEFAULT_PROFILE_IMAGE})`,
  });

  const avatarClasses = classNames(
    "UserProfilePicture__avatar",
    avatarClassName,
    avatarVars
  );

  const userDisplayName = user.anonMode ? DEFAULT_PARTY_NAME : user.partyName;

  return (
    <div className={containerClasses}>
      <UserReactions
        user={user}
        isMuted={isAudioEffectDisabled}
        reactionPosition={reactionPosition}
      >
        {/* @debt can we use src/components/atoms/UserAvatar/UserAvatar.tsx here? Should we? */}
        <div
          role="img"
          aria-label={`${userDisplayName}'s avatar`}
          className={avatarClasses}
          onClick={openProfileModal}
        />
      </UserReactions>
    </div>
  );
};
