import React from "react";
import classNames from "classnames";

import { DEFAULT_PROFILE_IMAGE } from "settings";

import { User } from "types/User";

import { WithId } from "utils/id";

import "./UserAvatar.scss";

export interface UserAvatarProps {
  user?: WithId<User>;
  isOnline?: boolean;
  onClick?: () => void;
}

// @debt the UserProfilePicture component serves a very similar purpose to this, we should unify them as much as possible
export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  onClick,
  isOnline,
}) => {
  const avatarSrc = user?.pictureUrl ?? DEFAULT_PROFILE_IMAGE;

  const containerClasses = classNames("user-avatar", {
    "user-avatar--clickable": onClick !== undefined,
  });

  return (
    <div className={containerClasses}>
      <img
        onClick={onClick}
        className="user-avatar__image"
        src={avatarSrc}
        alt="user avatar"
      />
      {isOnline && <span className="user-avatar__status-dot" />}
    </div>
  );
};
