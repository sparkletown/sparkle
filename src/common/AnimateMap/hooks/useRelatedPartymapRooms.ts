import { useMemo } from "react";
import { AnimateMapSpace, SpaceId } from "common/AnimateMapCommon";

import { Room } from "types/rooms";

import { isTruthy } from "utils/types";
import { getLastUrlParam, getUrlWithoutTrailingSlash } from "utils/url";
import { WithVenue, withVenue } from "utils/venue";

import { useRelatedVenues } from "hooks/useRelatedVenues";

interface UseRelatedPartymapRoomsOptions {
  venue: AnimateMapSpace;
}

export type UseRelatedPartymapRoomsResult =
  | (WithVenue<Room> | Room)[]
  | undefined;

export const useRelatedPartymapRooms: (
  options: UseRelatedPartymapRoomsOptions
) => UseRelatedPartymapRoomsResult = ({ venue }) => {
  const {
    currentVenue: relatedPartymap,
    findVenueInRelatedVenues,
  } = useRelatedVenues({
    currentVenueId: venue.relatedPartymapId,
  });

  return useMemo(
    () =>
      relatedPartymap?.rooms?.map((portal) => {
        const noTrailSlashPortalUrl = getUrlWithoutTrailingSlash(portal.url);

        const [venueId] = getLastUrlParam(noTrailSlashPortalUrl) as SpaceId[];
        const portalVenue = findVenueInRelatedVenues({ spaceId: venueId });

        return portalVenue ? withVenue(portal, portalVenue) : portal;
      }),
    [relatedPartymap, findVenueInRelatedVenues]
  )?.filter(isTruthy);
};
