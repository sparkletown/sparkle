import React from "react";
import classNames from "classnames";

import "./UserAvatar.scss";

export interface UserAvatarProps {
  isOnline?: boolean;
  onClick?: () => void;
  avatarSrc?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  onClick,
  avatarSrc,
  isOnline,
}) => {
  const imageStyles = classnames("user-avatar-pic", {
    "user-avatar-pic--hasOnClick": onClick !== undefined,
  });

  return (
    <div className="user-avatar-container">
      <img
        onClick={onClick}
        className={imageStyles}
        src={avatarSrc}
        alt="user avatar"
      />
      {isOnline && <span className="user-avatar-status-dot" />}
    </div>
  );
};
