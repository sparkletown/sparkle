import React, { useMemo } from "react";

import { useSelector } from "hooks/useSelector";
import { usePartygoers } from "hooks/users";

import { currentVenueSelector, parentVenueSelector } from "utils/selectors";

import "./VenuePartygoers.scss";
// import { useRecentPartyUsers } from "hooks/users";

export const VenuePartygoers = () => {
  const venue = useSelector(currentVenueSelector);
  // const partygoers = useRecentPartyUsers(venue.name) ?? [];
  const parentVenue = useSelector(parentVenueSelector);
  const partygoers = usePartygoers();

  const currentVenueTitle = venue?.attendeesTitle ?? "partygoers";
  const attendeesTitle = parentVenue?.attendeesTitle ?? currentVenueTitle;
  const venueName = venue?.name;

  const currentVenuePartygoers = useMemo(() => {
    if (!venueName) return [];

    return partygoers.filter((partygoer) => partygoer.lastSeenIn?.[venueName]);
  }, [partygoers, venueName]);
  const numberOfPartygoers = currentVenuePartygoers.length;
  // const numberOfPartygoers = partygoers.length;

  return (
    <div className="venue-partygoers-container">
      {numberOfPartygoers} {attendeesTitle} online
    </div>
  );
};
