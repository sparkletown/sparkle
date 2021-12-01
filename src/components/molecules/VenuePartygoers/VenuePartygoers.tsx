import React from "react";

import { DEFAULT_ATTENDEES_TITLE } from "settings";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useCurrentWorld } from "hooks/useCurrentWorld";

import "./VenuePartygoers.scss";

export interface VenuePartygoersProps {
  worldId?: string;
}

export const VenuePartygoers: React.FC<VenuePartygoersProps> = ({
  worldId,
}) => {
  const { spaceSlug } = useSpaceParams();
  const { space } = useSpaceBySlug(spaceSlug);
  const { world } = useCurrentWorld({ worldId });

  // @debt recentUserCount should be moved to world
  const numberOfRecentWorldUsers = space?.recentUserCount ?? "";
  const attendeesTitle = world?.attendeesTitle ?? DEFAULT_ATTENDEES_TITLE ?? "";

  return (
    <div className="VenuePartygoers">
      {numberOfRecentWorldUsers} {attendeesTitle} online
    </div>
  );
};
