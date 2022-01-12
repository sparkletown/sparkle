import { useMemo } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { doc } from "firebase/firestore";

import { COLLECTION_WORLDS } from "settings";

import { World } from "api/world";

import { ReactHook } from "types/utility";

import { withIdConverter } from "utils/converters";
import { convertToFirestoreKey, WithId } from "utils/id";

type UseWorldById = ReactHook<
  string | undefined,
  {
    error?: Error;
    isLoaded: boolean;
    world?: WithId<World>;
  }
>;

export const useWorldById: UseWorldById = (worldId) => {
  const firestore = useFirestore();

  const {
    data: world,
    status,
    error,
  } = useFirestoreDocData<WithId<World>>(
    doc(
      firestore,
      COLLECTION_WORLDS,
      convertToFirestoreKey(worldId)
    ).withConverter<WithId<World>>(withIdConverter()),
    { initialData: undefined }
  );

  const isLoaded = status !== "loading";

  return useMemo(() => ({ world, isLoaded, error }), [world, error, isLoaded]);
};
