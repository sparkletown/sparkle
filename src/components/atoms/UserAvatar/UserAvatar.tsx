import React, { useMemo } from "react";
import classNames from "classnames";
import { isEqual } from "lodash";

import { DEFAULT_PARTY_NAME } from "settings";

import { Profile } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";
import {
  determineAvatar,
  getFirebaseStorageResizedImage,
  ImageResizeOptions,
} from "utils/image";

import { useVenueUserStatuses } from "hooks/useVenueUserStatuses";

import styles from "./UserAvatar.module.scss";

export type UserAvatarSize = "small" | "medium" | "large" | "xlarge" | "full";

export type UserAvatarUserFields = WithId<
  Pick<Profile, "partyName" | "pictureUrl" | "anonMode" | "status">
>;

export interface UserAvatarProps extends ContainerClassName {
  user?: UserAvatarUserFields;
  imageClassName?: string;
  showStatus?: boolean;
  onClick?: () => void;
  size?: UserAvatarSize;
}

// @debt The avatar sizes are a duplicate of $avatar-sizes-map inside UserAvatar.module.scss
const AVATAR_SIZE_MAP: { [key in UserAvatarSize]: number | null } = {
  small: 25,
  medium: 42,
  large: 54,
  xlarge: 100,
  full: null,
};

// @debt the UserProfilePicture component serves a very similar purpose to this, we should unify them as much as possible
export const _UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  containerClassName,
  imageClassName,
  onClick,
  showStatus,
  size,
}) => {
  // @debt until temporarily disable is online functionality
  const isOnline = false;

  const {
    userStatus,
    venueUserStatuses,
    isStatusEnabledForVenue,
  } = useVenueUserStatuses(user);

  const { src: imageSrc, onError: onImageLoadError } = useMemo(
    () => determineAvatar({ user }),
    [user]
  );

  const avatarSrc = useMemo((): string => {
    const facadeSize = size ? AVATAR_SIZE_MAP[size] : undefined;
    const resizeOptions: ImageResizeOptions = { fit: "crop" };
    if (facadeSize) {
      resizeOptions.width = resizeOptions.height = facadeSize;
    }

    return getFirebaseStorageResizedImage(imageSrc, resizeOptions);
  }, [size, imageSrc]);

  const userDisplayName: string = user?.partyName ?? DEFAULT_PARTY_NAME;

  const sizeStyleName = `avatarContainer__${size}`;

  const containerClasses = classNames(
    styles.avatarContainer,
    size && styles[sizeStyleName],
    containerClassName
  );

  const status = user?.status;

  const imageClasses = classNames(styles.userAvatar, imageClassName);

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
    // @debt until temporarily disable is online functionality
    // isOnline &&
    showStatus &&
    !!venueUserStatuses.length;

  return (
    <div className={containerClasses}>
      <img
        className={imageClasses}
        src={avatarSrc}
        alt={`${userDisplayName}'s avatar`}
        onClick={onClick}
        onError={onImageLoadError}
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
