import { useCallback, useMemo } from "react";

import { User } from "types/User";
import { WithId } from "utils/id";
import { partygoersSelector } from "utils/selectors";

import { useConnectPartyGoers } from "./useConnectPartyGoers";
import { useConnectRelatedVenues } from "./useConnectRelatedVenues";
import { useSelector } from "./useSelector";
import { useUserLastSeenThreshold } from "./useUserLastSeenThreshold";
import { useVenueId } from "./useVenueId";

/**
 * Hook to retrieve a list of partygoers who were in venueName
 * within lastSeenThreshold.
 *
 * @param venueName venueName to filter partygoers by
 */
export const usePartygoersThreshold = (venueName: string): WithId<User>[] => {
  useConnectPartyGoers();
  const venueId = useVenueId();
  const partygoers = useSelector(partygoersSelector) ?? [];

  const { parentVenue, relatedVenues } = useConnectRelatedVenues({
    venueId,
    withEvents: true,
  });

  const lastSeenThreshold = useUserLastSeenThreshold();

  const parentVenueName = parentVenue?.name ?? "";

  const filterPartygoersByHierarchy = useCallback(
    (partygoer: WithId<User>) => {
      return relatedVenues?.map((venue) => {
        return (
          partygoer?.lastSeenIn?.[parentVenueName || venueName || venue.name] >
          lastSeenThreshold
        );
      });
    },
    [lastSeenThreshold, parentVenueName, relatedVenues, venueName]
  );

  return useMemo(() => partygoers.filter(filterPartygoersByHierarchy), [
    partygoers,
    filterPartygoersByHierarchy,
  ]);
};
