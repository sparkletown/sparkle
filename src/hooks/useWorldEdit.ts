import { useFirestore, useFirestoreCollectionData } from "reactfire";

import { World } from "api/admin";

import { worldConverter } from "utils/converters";
import { WithId } from "utils/id";

type UseWorldEditResult = {
  world?: WithId<World>;
  isLoaded: boolean;
};

export const useWorldEdit: (worldId?: string) => UseWorldEditResult = (
  worldId
) => {
  const firestore = useFirestore();

  const worldsRef = firestore
    .collection("worlds")
    .where("slug", "==", worldId ?? "")
    .withConverter(worldConverter);

  const { data: worlds, status } = useFirestoreCollectionData<WithId<World>>(
    worldsRef,
    {
      initialData: undefined,
    }
  );

  const isWorldLoaded = status === "success";

  return {
    world: worlds?.[0],
    isLoaded: isWorldLoaded,
  };
};
