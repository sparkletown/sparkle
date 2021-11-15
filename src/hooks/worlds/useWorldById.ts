import { useFirestore, useFirestoreDocData } from "reactfire";

import { World } from "api/world";

import { worldConverter } from "utils/converters";
import { WithId } from "utils/id";

type UseWorldByIdResult = {
  world?: WithId<World>;
  isLoaded: boolean;
};

export const useWorldById: (worldId?: string) => UseWorldByIdResult = (
  worldId
) => {
  const firestore = useFirestore();

  const worldsRef = firestore
    .collection("worlds")
    .doc(worldId)
    .withConverter(worldConverter);

  const { data: world, status } = useFirestoreDocData<WithId<World>>(
    worldsRef,
    {
      initialData: undefined,
    }
  );

  const isWorldLoaded = status !== "loading";

  return {
    world,
    isLoaded: isWorldLoaded,
  };
};
