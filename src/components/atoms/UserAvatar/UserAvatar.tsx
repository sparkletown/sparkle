import React, { useMemo } from "react";
import classNames from "classnames";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useRecentWorldUsers } from "hooks/users";
import { useVenueUserStatuses } from "hooks/useVenueUserStatuses";
import { useVenueId } from "hooks/useVenueId";

import "./UserAvatar.scss";

export interface UserAvatarProps {
  user?: WithId<User>;
  containerClassName?: string;
  imageClassName?: string;
  showStatus?: boolean;
  onClick?: () => void;
  large?: boolean;
}

// @debt the UserProfilePicture component serves a very similar purpose to this, we should unify them as much as possible
export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  containerClassName,
  imageClassName,
  onClick,
  showStatus,
  large,
}) => {
  const venueId = useVenueId();
  const { recentWorldUsers } = useRecentWorldUsers();
  const { userStatus, isStatusEnabledForVenue } = useVenueUserStatuses(
    venueId,
    user
  );

  const avatarSrc: string = user?.anonMode
    ? DEFAULT_PROFILE_IMAGE
    : user?.pictureUrl ?? DEFAULT_PROFILE_IMAGE;

  const userDisplayName: string = user?.anonMode
    ? DEFAULT_PARTY_NAME
    : user?.partyName ?? DEFAULT_PARTY_NAME;

  const containerClasses = classNames("user-avatar", containerClassName, {
    "user-avatar--clickable": onClick !== undefined,
    "user-avatar--large": large,
  });

  const isOnline = useMemo(
    () => recentWorldUsers.find((worldUser) => worldUser.id === user?.id),
    [user, recentWorldUsers]
  );

  const imageClasses = classNames("user-avatar__image", imageClassName);

  const statusIndicatorClasses = classNames("user-avatar__status-indicator", {
    "user-avatar__status-indicator--large": large,
  });

  const statusIndicatorStyles = useMemo(
    () => ({ backgroundColor: userStatus.color }),
    [userStatus.color]
  );

  return (
    <div className={containerClasses}>
      <img
        className={imageClasses}
        src={avatarSrc}
        alt={`${userDisplayName}'s avatar`}
        onClick={onClick}
      />
      {/*
        'isStatusEnabledForVenue' checks if the user status is enabled from the venue config.
        'showStatus' is used to render this conditionally only in some of the screens.
      */}
      {isStatusEnabledForVenue && showStatus && isOnline && (
        <span
          className={statusIndicatorClasses}
          style={statusIndicatorStyles}
        />
      )}
    </div>
  );
};
