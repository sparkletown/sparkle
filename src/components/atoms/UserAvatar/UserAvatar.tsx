import React from "react";
import classNames from "classnames";

import "./UserAvatar.scss";

export interface UserAvatarProps {
  containerClassName?: string;
  imageClassName?: string;
  isOnline?: boolean;
  onClick?: () => void;
  avatarSrc?: string;
}

// @debt the UserProfilePicture component serves a very similar purpose to this, we should unify them as much as possible
export const UserAvatar: React.FC<UserAvatarProps> = ({
  containerClassName,
  imageClassName,
  onClick,
  avatarSrc,
  isOnline,
}) => {
  const containerStyles = classNames("user-avatar", containerClassName, {
    "user-avatar--clickable": onClick !== undefined,
  });

  const avatarClassNames = classNames("user-avatar__image", imageClassName);

  return (
    <div className={containerStyles}>
      <img
        onClick={onClick}
        className={avatarClassNames}
        src={avatarSrc}
        alt="user avatar"
      />
      {isOnline && <span className="user-avatar__status-dot" />}
    </div>
  );
};
