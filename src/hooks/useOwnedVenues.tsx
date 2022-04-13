import { useMemo } from "react";
import { where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES } from "settings";

import { LoadStatus } from "types/fire";
import { SpaceWithId, UserId } from "types/id";

import { useRefiCollection } from "hooks/fire/useRefiCollection";

export interface UseOwnedVenuesOptions {
  worldId?: string;
  userId: UserId | string;
}

type UseOwnedVenuesResult = LoadStatus & {
  ownedVenues: SpaceWithId[];
};

type UseOwnedVenues = (options: UseOwnedVenuesOptions) => UseOwnedVenuesResult;

export const useOwnedVenues: UseOwnedVenues = ({ worldId, userId }) => {
  const constraints = useMemo(
    () =>
      worldId
        ? [
            where("worldId", "==", worldId),
            where("owners", "array-contains", userId),
          ]
        : [where("owners", "array-contains", userId)],
    [worldId, userId]
  );

  const { data, isLoading } = useRefiCollection<SpaceWithId>({
    path: [COLLECTION_SPACES],
    constraints,
  });

  const ownedVenues = data || ALWAYS_EMPTY_ARRAY;

  return useMemo(
    () => ({
      isLoading,
      isLoaded: !isLoading,
      ownedVenues,
    }),
    [isLoading, ownedVenues]
  );
};
