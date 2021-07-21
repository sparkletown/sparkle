import { useMemo, useCallback } from "react";
import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { WithId, withId } from "utils/id";
import { ownedVenuesDataSelector } from "utils/selectors";

import { useFirestoreConnect, isLoaded } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

export const useConnectOwnedVenues = (userId?: string) => {
  useFirestoreConnect(
    userId
      ? {
          collection: "venues",
          where: [["owners", "array-contains", userId]],
          storeAs: "ownedVenues",
        }
      : undefined
  );
};

export interface UseOwnedVenuesProps {
  currentVenueId?: string;
}

export interface UseOwnedVenuesData {
  isLoaded: boolean;
  isLoading: boolean;

  currentVenue?: WithId<AnyVenue>;

  ownedVenues: WithId<AnyVenue>[];
  ownedVenuesIds: string[];

  findVenueInOwnedVenues: (
    searchedForVenueId: string
  ) => WithId<AnyVenue> | undefined;
}

export const useOwnedVenues: ReactHook<
  UseOwnedVenuesProps,
  UseOwnedVenuesData
> = ({ currentVenueId }): UseOwnedVenuesData => {
  const { userId } = useUser();
  useConnectOwnedVenues(userId);

  const ownedVenuesData = useSelector(ownedVenuesDataSelector);
  const ownedVenues = useSelector(ownedVenuesSelector);
  
  const ownedVenuesIds = useMemo(() => Object.keys(venues ?? {}), [venues]);

  const getVenueInOwnedVenues = useCallback(
    (searchedForVenueId: string) => {
      const foundVenue = venues?.[searchedForVenueId];
      return foundVenue ? withId(found, searchedForVenueId) : undefined;
    },
    [venues]
  );

  return useMemo(
    () => ({
      isLoaded: isLoaded(venues),
      isLoading: !isLoaded(venues),

      ownedVenues,
      ownedVenuesIds,

      currentVenue: currentVenueId
        ? findVenueInOwnedVenues(currentVenueId)
        : undefined,

      findVenueInOwnedVenues,
    }),
    [
      venues,
      ownedVenues,
      ownedVenuesIds,
      findVenueInOwnedVenues,
      currentVenueId,
    ]
  );
};
