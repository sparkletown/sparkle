import React from "react";

import { UserAvatar } from "components/atoms/UserAvatar";

import { WithId } from "utils/id";

import { User } from "types/User";

import { useWorldUserLocation } from "hooks/users";

export interface RunTabUserInfoProps {
  user: WithId<User>;
}

export const RunTabUserInfo: React.FC<RunTabUserInfoProps> = ({ user }) => {
  const { userLocation } = useWorldUserLocation(user?.id);
  const userLastSeenIn = userLocation?.lastSeenIn;

  const location = userLastSeenIn ? Object.keys(userLastSeenIn)?.[0] : "";

  return (
    <div key={user.id} className="RunTabUsers__row RunTabUsers__user">
      <UserAvatar user={user} showStatus size="small" />
      <div className="RunTabUsers__wrapper">
        <div className="RunTabUsers__name">{user.partyName}</div>
        {location && <div className="RunTabUsers__place">in {location}</div>}
      </div>
    </div>
  );
};
