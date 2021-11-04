import { useFirestore, useFirestoreDocData } from "reactfire";

import { World } from "api/admin";

import { worldConverter } from "utils/converters";
import { WithId } from "utils/id";

type UseWorldEditResult = {
  world?: WithId<World>;
  isLoaded: boolean;
};

export const useWorldById: (worldId?: string) => UseWorldEditResult = (
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

  const isWorldLoaded = status === "success";

  return {
    world,
    isLoaded: isWorldLoaded,
  };
};
