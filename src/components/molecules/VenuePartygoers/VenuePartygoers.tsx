import React from "react";

import { useSelector } from "hooks/useSelector";

import { currentVenueSelector, partygoersSelector } from "utils/selectors";

import { Venue } from "types/Venue";
import { User } from "types/User";

const filterVenuePartygoers = (partygoers: User[], venue: Venue) => {
  return (
    partygoers?.filter((partygoer) => partygoer.lastSeenIn[venue.name]) ?? []
  );
};

export const VenuePartygoers = () => {
  const venue = useSelector(currentVenueSelector);
  const partygoers = useSelector(partygoersSelector);

  const currentVenuePartygoers = filterVenuePartygoers(partygoers, venue);
  const numberOfPartygoers = currentVenuePartygoers.length;
  return <div>{numberOfPartygoers} burners online</div>;
};
