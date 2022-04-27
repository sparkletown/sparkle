import React from "react";

import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./RunTabUserInfo.scss";

export interface RunTabUserInfoProps {
  user: WithId<DisplayUser>;
}

export const RunTabUserInfo: React.FC<RunTabUserInfoProps> = ({ user }) => {
  return (
    <div key={user.id} className="RunTabUserInfo">
      <UserAvatar user={user} size="small" />
      <div className="RunTabUserInfo__user">
        <div>{user.partyName}</div>
      </div>
    </div>
  );
};
