import React from "react";

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
  return (
    <div className="user-avatar-container">
      <img
        onClick={onClick}
        className="user-avatar-pic"
        src={avatarSrc}
        alt="user avatar"
      />
      <span className="user-avatar-status-dot" />
    </div>
  );
};
