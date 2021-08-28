import React, { useMemo } from "react";
import classNames from "classnames";
import { isEqual } from "lodash";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";

import { User, UsernameVisibility } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useIsOnline } from "hooks/useIsOnline";
import { useVenueId } from "hooks/useVenueId";
import { useVenueUserStatuses } from "hooks/useVenueUserStatuses";

import { getFirebaseStorageResizedImage, ImageResizeOptions } from "../../../utils/image";

import "./UserAvatar.scss";

export type UserAvatarSize = "small" | "medium" | "large" | "full";

export interface UserAvatarProps extends ContainerClassName {
  user?: WithId<User>;
  imageClassName?: string;
  showNametag?: UsernameVisibility;
  showStatus?: boolean;
  onClick?: () => void;
  size?: UserAvatarSize;
}

// @debt The avatar sizes are a duplicate of $avatar-sizes-map inside UserAvatar.scss
const AVATAR_SIZE_MAP: { [key in UserAvatarSize]: number | null } = {
  "small": 25,
  "medium": 40,
  "large": 54,
  "full": null
}

// @debt the UserProfilePicture component serves a very similar purpose to this, we should unify them as much as possible
export const _UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  containerClassName,
  imageClassName,
  showNametag,
  onClick,
  showStatus,
  size,
}) => {
  const venueId = useVenueId();

  const { isOnline } = useIsOnline(user?.id);

  const {
    userStatus,
    venueUserStatuses,
    isStatusEnabledForVenue,
  } = useVenueUserStatuses(venueId, user);

  const avatarSrc = useMemo((): string => {
    const url = user?.anonMode
      ? DEFAULT_PROFILE_IMAGE
      : user?.pictureUrl ?? DEFAULT_PROFILE_IMAGE;

    const facadeSize = size ? AVATAR_SIZE_MAP[size] : undefined;
    const resizeOptions: ImageResizeOptions = { fit: "crop" };
    if (facadeSize) {
      resizeOptions.width = resizeOptions.height = facadeSize;
    }

    return getFirebaseStorageResizedImage(url, resizeOptions);
  }, [user, size])

  const userDisplayName: string = user?.anonMode
    ? DEFAULT_PARTY_NAME
    : user?.partyName ?? DEFAULT_PARTY_NAME;

  const containerClasses = classNames("UserAvatar", containerClassName, {
    "UserAvatar--clickable": onClick !== undefined,
    [`UserAvatar--${size}`]: size,
  });

  const status = user?.status;

  const nametagClasses = classNames("UserAvatar__nametag", {
    "UserAvatar__nametag--hover": showNametag === UsernameVisibility.hover,
  });

  const imageClasses = classNames("UserAvatar__image", imageClassName);

  const statusIndicatorClasses = classNames("UserAvatar__status-indicator", {
    "UserAvatar__status-indicator--online": isOnline,
    [`UserAvatar__status-indicator--${status}`]: isOnline && status,
    [`UserAvatar__status-indicator--${size}`]: size,
  });

  const statusIndicatorStyles = useMemo(
    () => ({ backgroundColor: userStatus.color }),
    [userStatus.color]
  );

  //'isStatusEnabledForVenue' checks if the user status is enabled from the venue config.
  //'showStatus' is used to render this conditionally only in some of the screens.
  const hasUserStatus =
    isStatusEnabledForVenue &&
    isOnline &&
    showStatus &&
    !!venueUserStatuses.length;

  return (
    <div className={containerClasses}>
      {showNametag && <div className={nametagClasses}>{user?.partyName}</div>}
      <img
        className={imageClasses}
        src={avatarSrc}
        alt={`${userDisplayName}'s avatar`}
        onClick={onClick}
      />

      {hasUserStatus && (
        <span
          className={statusIndicatorClasses}
          style={statusIndicatorStyles}
        />
      )}
    </div>
  );
};

export const UserAvatar = React.memo(_UserAvatar, isEqual);
