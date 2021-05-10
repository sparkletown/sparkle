import React, { useMemo } from "react";

import { useRecentWorldUsers } from "hooks/users";
import { useLegacyConnectRelatedVenues } from "hooks/useRelatedVenues";
import { useVenueId } from "hooks/useVenueId";

import "./VenuePartygoers.scss";

export const VenuePartygoers = () => {
  const venueId = useVenueId();
  const {
    parentVenue,
    currentVenue,
    isCurrentVenueLoaded,
  } = useLegacyConnectRelatedVenues({ venueId });

  const { recentWorldUsers, isRecentWorldUsersLoaded } = useRecentWorldUsers();

  const numberOfRecentWorldUsers = recentWorldUsers.length;

  const title = useMemo<string>(() => {
    if (!isCurrentVenueLoaded || !isRecentWorldUsersLoaded) return "";

    const attendeesTitle =
      parentVenue?.attendeesTitle ??
      currentVenue?.attendeesTitle ??
      "attendees";

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
