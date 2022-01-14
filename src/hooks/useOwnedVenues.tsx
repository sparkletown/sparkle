import { useMemo } from "react";
import { where } from "firebase/firestore";

import { COLLECTION_WORLDS } from "settings";

import { UserId } from "types/id";
import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { convertToFirestoreKey, WithId } from "utils/id";

import { useRefiCollection } from "hooks/reactfire/useRefiCollection";

export interface UseOwnedVenuesOptions {
  worldId?: string;
  currentVenueId?: string;
  userId: UserId;
}

export interface UseOwnedVenuesResult {
  isLoading: boolean;
  currentVenue?: WithId<AnyVenue>;
  ownedVenues: WithId<AnyVenue>[];
}

export const useOwnedVenues: ReactHook<
  UseOwnedVenuesOptions,
  UseOwnedVenuesResult
> = ({ worldId, currentVenueId, userId }): UseOwnedVenuesResult => {
  const { data: venues, isLoading: isLoadingSpaces } =
    useRefiCollection<AnyVenue>({
      path: [COLLECTION_WORLDS],
      constraints: [
        where("worldId", "==", convertToFirestoreKey(worldId)),
        where("owners", "array-contains", convertToFirestoreKey(userId)),
      ],
    });

  return useMemo(
    () => ({
      isLoading: isLoadingSpaces,
      ownedVenues: venues ?? [],
      currentVenue: (venues || []).find((venue) => venue.id === currentVenueId),
    }),
    [venues, isLoadingSpaces, currentVenueId]
  );
};
