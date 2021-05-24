import React, { useCallback } from "react";
import classNames from "classnames";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserReactions } from "components/molecules/UserReactions";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./UserProfilePicture.scss";

// @debt This miniAvatars/'random avatar url' feature is currently disabled, it might be legacy code to be deleted?
// const generateRandomAvatarUrl = (id: string) =>
//   "/avatars/" +
//   RANDOM_AVATARS[Math.floor(id?.charCodeAt(0) % RANDOM_AVATARS.length)];

// @debt This code may no longer be needed if we remove the miniAvatars feature + handle anonMode in a similar way to
//   how it is currently being handled in UserAvatar
// export interface AvatarUrlProps {
//   user?: WithId<User>;
//   miniAvatars?: boolean;
// }
//
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
  showNametags?: string;
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
  showNametags,
  // @debt This feature is currently disabled and might be part of legacy code to be removed, see comment on generateRandomAvatarUrl above
  // miniAvatars = false,
}) => {
  const userId = user?.id;

  const { openUserProfileModal } = useProfileModalControls();

  const openProfileModal = useCallback(() => openUserProfileModal(user), [
    openUserProfileModal,
    user,
  ]);

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

  // @debt This is currently being handled within UserAvatar, so we may not need to keep it here anymore
  // const userDisplayName: string = user?.anonMode
  //   ? DEFAULT_PARTY_NAME
  //   : user?.partyName ?? DEFAULT_PARTY_NAME;

  return (
    <div
      className={containerClasses}
      onClick={openProfileModal}
      // @debt This is cuyrrently being handled within UserAvatar, so we may not need to keep it here anymore
      // role="img"
      // aria-label={`${userDisplayName}'s avatar`}
    >
      <UserAvatar
        user={user}
        containerClassName="UserProfilePicture__avatar"
        showNametags={showNametags}
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
