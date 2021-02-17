import React from "react";

import { User } from "types/User";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./OnlineUser.scss";

export interface OnlineUserProps {
  user: User;
  onClick: () => void;
}

export const OnlineUser: React.FC<OnlineUserProps> = ({ user, onClick }) => {
  return (
    <div className="online-user" onClick={onClick}>
      <UserAvatar avatarSrc={user.pictureUrl} isOnline />
      <div className="online-user-name">{user.partyName}</div>
    </div>
  );
};
