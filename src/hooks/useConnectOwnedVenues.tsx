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
  useOwnedVenuesProps,
  useOwnedVenuesData
> = ({ currentVenueId }): useOwnedVenuesData => {
  const { userId } = useUser();
  useConnectOwnedVenues(userId);

  const venues = useSelector(ownedVenuesDataSelector);

  const ownedVenuesIds = useMemo(() => Object.keys(venues ?? {}), [venues]);

  const ownedVenues = useMemo(
    () => Object.entries(venues ?? {}).map(([id, venue]) => withId(venue, id)),
    [venues]
  );

  const findVenueInOwnedVenues = useCallback(
    (searchedForVenueId: string) => {
      const found = venues?.[searchedForVenueId];
      return found ? withId(found, searchedForVenueId) : undefined;
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
