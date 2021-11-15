import React from "react";

import { DEFAULT_ATTENDEES_TITLE } from "settings";

import { useCurrentWorld } from "hooks/useCurrentWorld";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import "./VenuePartygoers.scss";

export interface VenuePartygoersProps {
  worldId?: string;
}

export const VenuePartygoers: React.FC<VenuePartygoersProps> = ({
  worldId,
}) => {
  const { sovereignVenue } = useRelatedVenues();
  const { world } = useCurrentWorld({ worldId });

  // @debt recentUserCount should be moved to world
  const numberOfRecentWorldUsers = sovereignVenue?.recentUserCount ?? "";
  const attendeesTitle = world?.attendeesTitle ?? DEFAULT_ATTENDEES_TITLE ?? "";

  return (
    <div className="VenuePartygoers">
      {numberOfRecentWorldUsers} {attendeesTitle} online
    </div>
  );
};
