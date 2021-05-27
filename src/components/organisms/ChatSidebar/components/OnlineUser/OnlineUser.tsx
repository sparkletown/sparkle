import React from "react";

import { User } from "types/User";

import { WithId } from "utils/id";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./OnlineUser.scss";

export interface OnlineUserProps {
  user: WithId<User>;
  onClick?: () => void;
}

export const OnlineUser: React.FC<OnlineUserProps> = ({ user, onClick }) => {
  return (
    <div className="online-user" onClick={onClick}>
      <UserAvatar user={user} showStatus />
      <div className="online-user__name">{user.partyName}</div>
    </div>
  );
};
