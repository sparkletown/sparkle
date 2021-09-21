import React from "react";

import { User } from "types/User";

import { WithId } from "utils/id";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./RunTabUserInfo.scss";

export interface RunTabUserInfoProps {
  user: WithId<User>;
}

export const RunTabUserInfo: React.FC<RunTabUserInfoProps> = ({ user }) => {
  const location = user.lastVenueIdSeenIn;

  return (
    <div key={user.id} className="RunTabUserInfo">
      <UserAvatar user={user} showStatus size="small" />
      <div className="RunTabUserInfo__user">
        <div>{user.partyName}</div>
        {location && <div className="RunTabUserInfo__place">in {location}</div>}
      </div>
    </div>
  );
};
