import React, { useMemo } from "react";

import { useRecentWorldUsers } from "hooks/users";

import "./VenuePartygoers.scss";

export const VenuePartygoers: React.FC = () => {
  const { recentWorldUsers, isRecentWorldUsersLoaded } = useRecentWorldUsers();

  const numberOfRecentWorldUsers = recentWorldUsers.length;

  const userCount = useMemo<number>(
    () => (isRecentWorldUsersLoaded ? numberOfRecentWorldUsers : 0),
    [isRecentWorldUsersLoaded, numberOfRecentWorldUsers]
  );

  return (
    <div className="VenuePartygoers__container">
      <span className="VenuePartygoers__users-count">{userCount}</span> burners
      here
    </div>
  );
};
