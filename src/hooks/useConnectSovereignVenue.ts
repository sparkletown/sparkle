import { useMemo } from "react";

import { AnyVenue } from "types/venues";

import { useSelector } from "./useSelector";
import { useFirestoreConnect } from "./useFirestoreConnect";
import { useSovereignVenueId } from "./useSovereignVenueId";
import {
  isSovereignVenueRequestedSelector,
  sovereignVenueSelector,
} from "utils/selectors";
import { WithId, withId } from "utils/id";

export interface UseConnectSovereignVenueReturn {
  sovereignVenue?: WithId<AnyVenue>;
  isSovereignVenueLoading: boolean;
}

export const useConnectSovereignVenue = (
  venueId?: string
): UseConnectSovereignVenueReturn => {
  console.log(0, venueId);

  const { sovereignVenueId } = useSovereignVenueId({ venueId });

  console.log("1", sovereignVenueId);

  useFirestoreConnect(() => {
    if (!sovereignVenueId) return [];

    return [
      {
        collection: "venues",
        doc: sovereignVenueId,
        storeAs: "sovereignVenue",
      },
    ];
  });

  const sovereignVenue = useSelector(sovereignVenueSelector);
  const isSovereignVenueLoading = useSelector(
    isSovereignVenueRequestedSelector
  );

  return useMemo(
    () => ({
      sovereignVenue:
        sovereignVenue && sovereignVenueId
          ? withId(sovereignVenue, sovereignVenueId)
          : undefined,
      isSovereignVenueLoading: isSovereignVenueLoading,
    }),
    [isSovereignVenueLoading, sovereignVenue, sovereignVenueId]
  );
};
