import React, { useMemo } from "react";

import { useRecentWorldsUsers } from "hooks/users";
import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";
import { useVenueId } from "hooks/useVenueId";

import "./VenuePartygoers.scss";

export const VenuePartygoers = () => {
  const venueId = useVenueId();
  const {
    parentVenue,
    currentVenue,
    isCurrentVenueLoaded,
  } = useConnectRelatedVenues({ venueId });

  const { recentWorldUsers, isRecentWorldUsersLoaded } = useRecentWorldsUsers();

  const numberOfRecentWorldUsers = recentWorldUsers.length;

  const title = useMemo<string>(() => {
    if (!isCurrentVenueLoaded || !isRecentWorldUsersLoaded) return "";

    const attendeesTitle =
      parentVenue?.attendeesTitle ??
      currentVenue?.attendeesTitle ??
      "partygoers";

    return `${numberOfRecentWorldUsers} ${attendeesTitle} online`;
  }, [
    isCurrentVenueLoaded,
    parentVenue,
    currentVenue,
    numberOfRecentWorldUsers,
    isRecentWorldUsersLoaded,
  ]);

  return <div className="venue-partygoers-container">{title}</div>;
};
