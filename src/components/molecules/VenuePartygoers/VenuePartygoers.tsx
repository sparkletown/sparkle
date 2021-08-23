import React, { useMemo } from "react";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRecentWorldUsers } from "hooks/users";

import "./VenuePartygoers.scss";

export interface VenuePartygoersProps {
  venueId: string;
}

export const VenuePartygoers: React.FC<VenuePartygoersProps> = ({
  venueId,
}) => {
  const { isLoading } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const { recentWorldUsers, isRecentWorldUsersLoaded } = useRecentWorldUsers();

  const numberOfRecentWorldUsers = recentWorldUsers.length;

  const userCount = useMemo<number>(() => {
    if (isLoading || !isRecentWorldUsersLoaded) return 0;

    return numberOfRecentWorldUsers;
  }, [isLoading, isRecentWorldUsersLoaded, numberOfRecentWorldUsers]);

  return (
    <div className="VenuePartygoers__container">
      <span className="VenuePartygoers__number">{userCount}</span> burners here
    </div>
  );
};
