import React, { useCallback, useMemo } from "react";
import classNames from "classnames";

import { WithId } from "utils/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useVenueId } from "hooks/useVenueId";

import {
  DEFAULT_PARTY_NAME,
  DEFAULT_PROFILE_IMAGE,
  RANDOM_AVATARS,
} from "settings";

import { User } from "types/User";

import { UserReactions } from "./UserReactions";

import "./UserProfilePicture.scss";

const randomAvatarUrl = (id: string) =>
  "/avatars/" +
  RANDOM_AVATARS[Math.floor(id?.charCodeAt(0) % RANDOM_AVATARS.length)];

export interface AvatarUrlProps {
  user: WithId<User>;
  miniAvatars?: boolean;
}

const avatarUrl = ({ user, miniAvatars }: AvatarUrlProps): string => {
  const { id, anonMode, pictureUrl } = user;

  if (anonMode || !id) {
    return DEFAULT_PROFILE_IMAGE;
  }

  if (!miniAvatars && pictureUrl) {
    return pictureUrl;
  }

  // @debt how is this intended to be used? Why doesn't it use the profile image? It seems to be something set on venue config..
  if (miniAvatars) {
    return randomAvatarUrl(id);
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
  const venueId = useVenueId();

  const { openUserProfileModal } = useProfileModalControls();

  const openProfileModal = useCallback(() => openUserProfileModal(user), [
    openUserProfileModal,
    user,
  ]);

  const pictureUrl = avatarUrl({ user, miniAvatars });
  // @debt useImage tries to load the images twice, which is made worse by us not caching images retrieved from firebase,
  //  it's only used to handle the edgecase of showing a default when images are missing. Can we live without it?
  // const { loadedImageUrl: pictureUrl } = useImage({
  //   src: avatarUrl({ user, miniAvatars }),
  //   fallbackSrc: () => randomAvatarUrl(user.id),
  // });

  const containerClasses = classNames("UserProfilePicture", containerClassName);

  const avatarClasses = classNames(
    "UserProfilePicture__avatar",
    avatarClassName
  );

  const avatarStyles = useMemo(
    () => ({
      backgroundImage: pictureUrl ? `url(${pictureUrl})` : undefined,
    }),
    [pictureUrl]
  );

  const userDisplayName = user.anonMode ? DEFAULT_PARTY_NAME : user.partyName;

  return (
    <div className={containerClasses}>
      {venueId && (
        <UserReactions
          venueId={venueId}
          user={user}
          isMuted={isAudioEffectDisabled}
          reactionPosition={reactionPosition}
        >
          {/* @debt can we use src/components/atoms/UserAvatar/UserAvatar.tsx here? Should we? */}
          <div
            role="img"
            aria-label={`${userDisplayName}'s avatar`}
            className={avatarClasses}
            style={avatarStyles}
            onClick={openProfileModal}
          />
        </UserReactions>
      )}
    </div>
  );
};
