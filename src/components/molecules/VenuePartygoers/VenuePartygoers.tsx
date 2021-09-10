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
  const { isLoading, parentVenue, currentVenue } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const { numberOnlineUsers, isRecentWorldUsersLoaded } = useRecentWorldUsers();

  const title = useMemo<string>(() => {
    if (isLoading || !isRecentWorldUsersLoaded) return "";

    const attendeesTitle =
      parentVenue?.attendeesTitle ??
      currentVenue?.attendeesTitle ??
      "attendees";

    return `${numberOnlineUsers} ${attendeesTitle} online`;
  }, [
    isLoading,
    isRecentWorldUsersLoaded,
    parentVenue?.attendeesTitle,
    currentVenue?.attendeesTitle,
    numberOnlineUsers,
  ]);

  return <div className="venue-partygoers-container">{title}</div>;
};
