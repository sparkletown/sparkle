import { useMemo } from "react";
import { where } from "firebase/firestore";

import { COLLECTION_SPACES } from "settings";

import { UserId } from "types/id";
import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { convertToFirestoreKey, WithId } from "utils/id";

import { useRefiCollection } from "hooks/reactfire/useRefiCollection";

export interface UseOwnedVenuesProps {
  worldId: string;
  currentVenueId?: string;
  userId: UserId;
}

export interface UseOwnedVenuesData {
  isLoading: boolean;
  currentVenue?: WithId<AnyVenue>;
  ownedVenues: WithId<AnyVenue>[];
}

export const useOwnedVenues: ReactHook<
  UseOwnedVenuesProps,
  UseOwnedVenuesData
> = ({ userId, worldId, currentVenueId }): UseOwnedVenuesData => {
  console.log("querying", worldId, userId);
  const {
    data: venues,
    isLoading: isLoadingSpaces,
  } = useRefiCollection<AnyVenue>({
    path: [COLLECTION_SPACES],
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
