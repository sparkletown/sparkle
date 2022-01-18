import { useMemo } from "react";

import { COLLECTION_WORLDS } from "settings";

import { WorldId, WorldWithId } from "types/id";
import { LoadStatus } from "types/reactfire";
import { ReactHook } from "types/utility";

import { convertToFirestoreKey } from "utils/id";

import { useRefiDocument } from "hooks/reactfire/useRefiDocument";

type UseWorldById = ReactHook<
  string | undefined,
  LoadStatus & {
    error?: Error;
    world?: WorldWithId;
    worldId?: WorldId;
  }
>;

export const useWorldById: UseWorldById = (worldId) => {
  const {
    data: world,
    isLoaded,
    isLoading,
    error,
  } = useRefiDocument<WorldWithId>([
    COLLECTION_WORLDS,
    convertToFirestoreKey(worldId),
  ]);

  return useMemo(
    () => ({
      world,
      worldId: world?.id,
      isLoaded,
      isLoading,
      error,
    }),
    [world, error, isLoaded, isLoading]
  );
};
