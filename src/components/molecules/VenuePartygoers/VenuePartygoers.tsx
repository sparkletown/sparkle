import React from "react";

import { useRelatedVenues } from "hooks/useRelatedVenues";

import "./VenuePartygoers.scss";

export const VenuePartygoers: React.FC = () => {
  const { sovereignVenue } = useRelatedVenues();

  const numberOfRecentWorldUsers = sovereignVenue?.recentUserCount;
  const attendeesTitle = sovereignVenue?.attendeesTitle ?? "attendees";

  return (
    <div className="venue-partygoers-container">
      {numberOfRecentWorldUsers} {attendeesTitle} online
    </div>
  );
};
