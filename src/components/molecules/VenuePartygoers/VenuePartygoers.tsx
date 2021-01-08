import React, { useMemo } from "react";

import { useSelector } from "hooks/useSelector";
import { usePartygoers } from "hooks/users";

import { currentVenueSelector, parentVenueSelector } from "utils/selectors";

import "./VenuePartygoers.scss";

export const VenuePartygoers = () => {
  const venue = useSelector(currentVenueSelector);
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

  return (
    <div className="venue-partygoers-container">
      {numberOfPartygoers} {attendeesTitle} online
    </div>
  );
};
