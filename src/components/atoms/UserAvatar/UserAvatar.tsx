import React from "react";
import classnames from "classnames";

import "./UserAvatar.scss";

export interface UserAvatarProps {
  isOnline?: boolean;
  onClick?: () => void;
  avatarSrc?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  onClick,
  avatarSrc,
}) => {
  const hasOnclick = onClick !== undefined;

  const imageStyles = classnames("user-avatar-pic", {
    "user-avatar-pic--hasOnClick": hasOnclick,
  });

  return (
    <div className="user-avatar-container">
      <img
        onClick={onClick}
        className={imageStyles}
        src={avatarSrc}
        alt="user avatar"
      />
      <span className="user-avatar-status-dot" />
    </div>
  );
};
