import React, { useMemo } from "react";

import { useSelector } from "hooks/useSelector";
import { usePartygoers } from "hooks/useUsers";

import { currentVenueSelector, parentVenueSelector } from "utils/selectors";

import { Venue } from "types/Venue";
import { User } from "types/User";

import "./VenuePartygoers.scss";

const filterVenuePartygoers = (partygoers: User[], venue: Venue) => {
  return (
    partygoers?.filter((partygoer) => partygoer.lastSeenIn?.[venue.name]) ?? []
  );
};

export const VenuePartygoers = () => {
  const venue = useSelector(currentVenueSelector);
  const parentVenue = useSelector(parentVenueSelector);
  const partygoers = usePartygoers();

  const currentVenueTitle = venue.attendeesTitle ?? "partygoers";
  const attendeesTitle = parentVenue?.attendeesTitle ?? currentVenueTitle;
  const currentVenuePartygoers = useMemo(
    () => filterVenuePartygoers(partygoers, venue),
    [partygoers, venue]
  );
  const numberOfPartygoers = currentVenuePartygoers.length;

  return (
    <div className="venue-partygoers-container">
      {numberOfPartygoers} {attendeesTitle} online
    </div>
  );
};
