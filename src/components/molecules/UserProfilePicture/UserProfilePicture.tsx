import React, { useCallback } from "react";
import classNames from "classnames";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserReactions } from "components/molecules/UserReactions";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./UserProfilePicture.scss";

// const generateRandomAvatarUrl = (id: string) =>
//   "/avatars/" +
//   RANDOM_AVATARS[Math.floor(id?.charCodeAt(0) % RANDOM_AVATARS.length)];

// export interface AvatarUrlProps {
//   user?: WithId<User>;
//   miniAvatars?: boolean;
// }

// const getAvatarUrl = ({ user, miniAvatars }: AvatarUrlProps): string => {
//   const { id: userId, anonMode, pictureUrl } = user ?? {};
//
//   if (!userId || anonMode) {
//     return DEFAULT_PROFILE_IMAGE;
//   }
//
//   if (!miniAvatars && pictureUrl) {
//     return pictureUrl;
//   }
//
//   // @debt how is this intended to be used? Why doesn't it use the profile image? It seems to be something set on venue config..
//   if (miniAvatars) {
//     return generateRandomAvatarUrl(userId);
//   }
//
//   return DEFAULT_PROFILE_IMAGE;
// };

export interface UserProfilePictureProp {
  user?: WithId<User>;
  isAudioEffectDisabled?: boolean;
  containerClassName?: string;
  reactionPosition?: "left" | "right";

  /**
   * @deprecated Note: This feature is currently disabled.
   */
  miniAvatars?: boolean;
}

export const UserProfilePicture: React.FC<UserProfilePictureProp> = ({
  user,
  isAudioEffectDisabled = true,
  containerClassName,
  reactionPosition = "right",
  // miniAvatars = false,
}) => {
  const userId = user?.id;

  const { openUserProfileModal } = useProfileModalControls();

  const openProfileModal = useCallback(() => openUserProfileModal(user), [
    openUserProfileModal,
    user,
  ]);

  // const pictureUrl = getAvatarUrl({ user, miniAvatars });

  // @debt useImage tries to load the images twice, which is made worse by us not caching images retrieved from firebase,
  //  it's only used to handle the edgecase of showing a default when images are missing. Can we live without it?
  // const { loadedImageUrl: pictureUrl } = useImage({
  //   src: avatarUrl({ user, miniAvatars }),
  //   fallbackSrc: () => randomAvatarUrl(user.id),
  // });

  // const containerVars = useCss({
  //   "--user-profile-picture-avatar-url": pictureUrl
  //     ? `url(${pictureUrl})`
  //     : `url(${DEFAULT_PROFILE_IMAGE})`,
  // });

  const containerClasses = classNames(
    "UserProfilePicture",
    containerClassName
    // containerVars
  );

  // const userDisplayName: string = user?.anonMode
  //   ? DEFAULT_PARTY_NAME
  //   : user?.partyName ?? DEFAULT_PARTY_NAME;

  return (
    <div
      className={containerClasses}
      // role="img"
      // aria-label={`${userDisplayName}'s avatar`}
      onClick={openProfileModal}
    >
      <UserAvatar user={user} containerClassName="UserProfilePicture__avatar" />

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
