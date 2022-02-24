import { useMemo } from "react";
import { where } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  COLLECTION_WORLDS,
  FIELD_HIDDEN,
  FIELD_OWNERS,
} from "settings";

import { LoadStatus } from "types/fire";
import { UserId, WorldWithId } from "types/id";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

type UseWorldsByOwner = (options: {
  userId: UserId | string;
}) => LoadStatus & { ownWorlds: WorldWithId[] };

export const useWorldsByOwner: UseWorldsByOwner = ({ userId }) => {
  const path = useMemo(() => [COLLECTION_WORLDS], []);

  const constraints = useMemo(
    () => [
      where(FIELD_HIDDEN, "==", false),
      userId ? where(FIELD_OWNERS, "array-contains", userId) : undefined,
    ],
    [userId]
  );

  const { error, isLoading, isLoaded, data } = useLiveCollection<WorldWithId>({
    path,
    constraints,
  });

  return useMemo(
    () => ({
      error,
      isLoading,
      isLoaded,
      ownWorlds: data ?? ALWAYS_EMPTY_ARRAY,
    }),
    [error, isLoading, isLoaded, data]
  );
};
