import { useMemo } from "react";
import { where } from "firebase/firestore";

import { COLLECTION_WORLDS } from "settings";

import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useRefiCollection } from "hooks/reactfire/useRefiCollection";
import { useLoginCheck } from "hooks/user/useLoginCheck";

export interface UseOwnedVenuesProps {
  worldId?: string;
  currentVenueId?: string;
}

export interface UseOwnedVenuesData {
  isLoading: boolean;
  currentVenue?: WithId<AnyVenue>;
  ownedVenues: WithId<AnyVenue>[];
}

export const useOwnedVenues: ReactHook<
  UseOwnedVenuesProps,
  UseOwnedVenuesData
> = ({ worldId, currentVenueId }): UseOwnedVenuesData => {
  const { userId, isLoading: isLoadingCheck } = useLoginCheck();

  const {
    data: venues,
    status,
    isLoading: isLoadingSpaces,
  } = useRefiCollection<AnyVenue>({
    path: [COLLECTION_WORLDS],
    constraints: [
      where("worldId", "==", worldId ?? ""),
      where("owners", "array-contains", userId ?? ""),
    ],
  });

  return useMemo(
    () => ({
      isLoading: isLoadingCheck && isLoadingSpaces,
      ownedVenues: venues ?? [],
      currentVenue: (venues || []).find((venue) => venue.id === currentVenueId),
    }),
    [venues, isLoadingCheck, isLoadingSpaces, currentVenueId, status]
  );
};
