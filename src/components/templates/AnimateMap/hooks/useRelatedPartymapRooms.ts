import { useMemo } from "react";

import { Room } from "types/rooms";
import { ReactHook } from "types/utility";
import { AnimateMapVenue, AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { isTruthy } from "utils/types";
import { getLastUrlParam, getUrlWithoutTrailingSlash } from "utils/url";

import { useRelatedVenues } from "hooks/useRelatedVenues";

export interface UseRelatedPartymapRoomsProps {
  venue: WithId<AnimateMapVenue>;
}

export type UseRelatedPartymapRoomsData =
  | (Room & { venue: AnyVenue })[]
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

        if (!portalVenue) return undefined;

        return {
          ...portal,
          venue: portalVenue,
        };
      }),
    [relatedPartymap, findVenueInRelatedVenues]
  )?.filter(isTruthy);
};
