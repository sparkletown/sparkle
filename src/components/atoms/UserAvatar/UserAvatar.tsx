import React, { useMemo } from "react";
import classNames from "classnames";
import { isEqual } from "lodash";

import { DEFAULT_PARTY_NAME } from "settings";

import { BaseUser, UsernameVisibility, UserStatus } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { DesignVersion, useDesignVersion } from "hooks/useDesignVersion";
import { UserAvatarSize, useUserAvatar } from "hooks/useUserAvatar";
import { useVenueUserStatuses } from "hooks/useVenueUserStatuses";

import "./UserAvatar.scss";

export type UserAvatarUserFields = WithId<
  Pick<BaseUser, "partyName" | "pictureUrl" | "anonMode" | "status">
>;

export type { UserAvatarSize };

export interface UserAvatarProps extends ContainerClassName {
  user?: UserAvatarUserFields;
  imageClassName?: string;
  showNametag?: UsernameVisibility;
  showStatus?: boolean;
  onClick?: () => void;
  size?: UserAvatarSize;
}
export interface UserAvatarPresentationProps extends ContainerClassName {
  showNametag?: UsernameVisibility;
  imageClassName?: string;
  avatarSrc: string;
  userDisplayName: string;
  onClick?: () => void;
  userStatus?: UserStatus;
  size?: UserAvatarSize;
  isOnline?: boolean;
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
  // @debt until temporarily disable is online functionality
  const isOnline = false;

  const {
    userStatus,
    venueUserStatuses,
    isStatusEnabledForVenue,
  } = useVenueUserStatuses(user);

  const avatarSrc = useUserAvatar(user, size);

  const userDisplayName: string = user?.anonMode
    ? DEFAULT_PARTY_NAME
    : user?.partyName ?? DEFAULT_PARTY_NAME;

  //'isStatusEnabledForVenue' checks if the user status is enabled from the venue config.
  //'showStatus' is used to render this conditionally only in some of the screens.
  const hasUserStatus =
    isStatusEnabledForVenue &&
    // @debt until temporarily disable is online functionality
    // isOnline &&
    showStatus &&
    !!venueUserStatuses.length;

  const componentArgs = {
    containerClassName,
    showNametag,
    imageClassName,
    avatarSrc,
    userDisplayName,
    onClick,
    userStatus: hasUserStatus ? userStatus : undefined,
    size,
    isOnline,
  };

  return <UserAvatarPresentation {...componentArgs} />;
};

/*
 * UserAvatar presentation component that contains no logic.
 */
export const UserAvatarPresentation: React.FC<UserAvatarPresentationProps> = ({
  containerClassName,
  showNametag,
  imageClassName,
  avatarSrc,
  userDisplayName,
  onClick,
  userStatus,
  size,
  isOnline,
}) => {
  const designVersion = useDesignVersion();
  const imageClasses = classNames("UserAvatar__image", imageClassName);

  const nametagClasses = classNames("UserAvatar__nametag", {
    "UserAvatar__nametag--hover": showNametag === UsernameVisibility.hover,
  });

  const statusIndicatorClasses = userStatus
    ? classNames("UserAvatar__status-indicator", {
        "UserAvatar__status-indicator--online": isOnline,
        [`UserAvatar__status-indicator--${userStatus.status}`]:
          isOnline && userStatus.status,
        [`UserAvatar__status-indicator--${size}`]: size,
      })
    : "";

  const statusIndicatorStyles = useMemo(
    () => (userStatus ? { backgroundColor: userStatus.color } : {}),
    [userStatus]
  );

  const containerClasses = classNames("UserAvatar", containerClassName, {
    "UserAvatar--clickable": onClick !== undefined,
    [`UserAvatar--${size}`]: size,
  });

  if (designVersion === DesignVersion.disco) {
    const divStyles = {
      backgroundImage: `url(${avatarSrc})`,
    };
    return (
      <div
        className="relative float-left top-1 -ml-10 w-8 h-8 rounded-full bg-gray-400"
        style={divStyles}
      />
    );
  }

  return (
    <div className={containerClasses}>
      {showNametag && <div className={nametagClasses}>{userDisplayName}</div>}
      <img
        className={imageClasses}
        src={avatarSrc}
        alt={`${userDisplayName}'s avatar`}
        onClick={onClick}
      />

      {userStatus && (
        <span
          className={statusIndicatorClasses}
          style={statusIndicatorStyles}
        />
      )}
    </div>
  );
};

export const UserAvatar = React.memo(_UserAvatar, isEqual);
