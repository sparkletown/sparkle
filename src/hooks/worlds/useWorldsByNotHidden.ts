import { useMemo } from "react";
import { collection, getFirestore, query, where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_WORLDS, FIELD_HIDDEN } from "settings";

import { World } from "api/world";

import { LoadStatus } from "types/fire";
import { WorldId, WorldWithId } from "types/id";

import { withIdConverter } from "utils/converters";

import { useLiveQuery } from "hooks/fire/useLiveQuery";

type UseWorldsByNotHidden = () => LoadStatus & { worlds: WorldWithId[] };

export const useWorldsByNotHidden: UseWorldsByNotHidden = () => {
  const memoizedQuery = useMemo(
    () =>
      query(
        collection(getFirestore(), COLLECTION_WORLDS),
        where(FIELD_HIDDEN, "==", false)
      ).withConverter(withIdConverter<World, WorldId>()),
    []
  );

  const { error, isLoading, isLoaded, data } = useLiveQuery(memoizedQuery);

  return useMemo(
    () => ({ error, isLoading, isLoaded, worlds: data ?? ALWAYS_EMPTY_ARRAY }),
    [error, isLoading, isLoaded, data]
  );
};
