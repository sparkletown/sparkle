import React from "react";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useWorldUserLocation } from "hooks/users";

import { UserAvatar } from "components/atoms/UserAvatar";

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
