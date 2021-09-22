import React from "react";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useWorldUserLocation } from "hooks/users";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./RunTabUserInfo.scss";

export interface RunTabUserInfoProps {
  user: WithId<User>;
}

export const RunTabUserInfo: React.FC<RunTabUserInfoProps> = ({ user }) => {
  const { userLocation } = useWorldUserLocation(user?.id);
  const userLastSeenIn = userLocation?.lastVenueIdSeenIn;

  const location = userLastSeenIn ? Object.keys(userLastSeenIn)?.[0] : "";

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
