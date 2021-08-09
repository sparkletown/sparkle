import { useMemo, useCallback } from "react";
import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { WithId, withId } from "utils/id";
import { ownedVenuesDataSelector, ownedVenuesSelector } from "utils/selectors";

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

  const ownedVenuesIds = useMemo(() => Object.keys(ownedVenuesData ?? {}), [
    ownedVenuesData,
  ]);

  const findVenueInOwnedVenues = useCallback(
    (searchedForVenueId: string) => {
      const foundVenue = ownedVenuesData?.[searchedForVenueId];
      return foundVenue ? withId(foundVenue, searchedForVenueId) : undefined;
    },
    [ownedVenuesData]
  );

  return useMemo(
    () => ({
      isLoaded: isLoaded(ownedVenuesData),
      isLoading: !isLoaded(ownedVenuesData),

      ownedVenues: ownedVenues ?? [],
      ownedVenuesIds,

      currentVenue: currentVenueId
        ? findVenueInOwnedVenues(currentVenueId)
        : undefined,

      findVenueInOwnedVenues,
    }),
    [
      ownedVenues,
      ownedVenuesIds,
      findVenueInOwnedVenues,
      currentVenueId,
      ownedVenuesData,
    ]
  );
};
