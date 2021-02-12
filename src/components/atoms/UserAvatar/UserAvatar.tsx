import React from "react";

import "./UserAvatar.scss";

export type UserAvatarSizes = "sm" | "md" | "lg";

export interface UserAvatarProps {
  isOnline?: boolean;
  onClick?: () => void;
  avatarSrc?: string;
  size?: UserAvatarSizes;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  onClick,
  avatarSrc,
  size = "sm",
}) => {
  return (
    <div className="user-avatar-container">
      <img onClick={onClick} className="user-avatar-pic" src={avatarSrc} />
      <span className="user-avatar-status-dot" />
    </div>
  );
};
