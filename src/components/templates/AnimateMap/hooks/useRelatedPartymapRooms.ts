import { useMemo } from "react";

import { Room } from "types/rooms";
import { ReactHook } from "types/utility";
import { AnimateMapVenue } from "types/venues";

import { WithId } from "utils/id";
import { isTruthy } from "utils/types";
import { getLastUrlParam, getUrlWithoutTrailingSlash } from "utils/url";
import { WithVenue, withVenue } from "utils/venue";

import { useRelatedVenues } from "hooks/useRelatedVenues";

export interface UseRelatedPartymapRoomsProps {
  venue: WithId<AnimateMapVenue>;
}

export type UseRelatedPartymapRoomsData =
  | (WithVenue<Room> | Room)[]
  | undefined;

export const useRelatedPartymapRooms: ReactHook<
  UseRelatedPartymapRoomsProps,
  UseRelatedPartymapRoomsData
> = ({ venue }) => {
  const { findVenueInRelatedVenues } = useRelatedVenues({
    currentVenueId: venue.id,
  });
  const relatedPartymap = findVenueInRelatedVenues(venue.relatedPartymapId);

  return useMemo(
    () =>
      relatedPartymap?.rooms?.map((portal) => {
        const noTrailSlashPortalUrl = getUrlWithoutTrailingSlash(portal.url);

        const [venueId] = getLastUrlParam(noTrailSlashPortalUrl);
        const portalVenue = findVenueInRelatedVenues(venueId);

        return portalVenue ? withVenue(portal, portalVenue) : portal;
      }),
    [relatedPartymap, findVenueInRelatedVenues]
  )?.filter(isTruthy);
};
