import React from "react";

import { DEFAULT_ATTENDEES_TITLE } from "settings";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useWorldById } from "hooks/worlds/useWorldById";

import "./VenuePartygoers.scss";

export interface VenuePartygoersProps {
  worldId?: string;
}

export const VenuePartygoers: React.FC<VenuePartygoersProps> = ({
  worldId,
}) => {
  const { sovereignVenue } = useRelatedVenues();
  const { world } = useWorldById({ worldId });

  // @debt recentUserCount should be moved to world
  const numberOfRecentWorldUsers = sovereignVenue?.recentUserCount ?? "";
  const attendeesTitle = world?.attendeesTitle ?? DEFAULT_ATTENDEES_TITLE ?? "";

  return (
    <div className="VenuePartygoers">
      {numberOfRecentWorldUsers} {attendeesTitle} online
    </div>
  );
};
