import { useFirestore, useFirestoreDocData } from "reactfire";
import { collection, doc } from "firebase/firestore";

import { COLLECTION_WORLDS } from "settings";

import { World } from "api/world";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

type UseWorldByIdResult = {
  world?: WithId<World>;
  isLoaded: boolean;
};

export const useWorldById: (worldId?: string) => UseWorldByIdResult = (
  worldId
) => {
  const firestore = useFirestore();

  const worldsRef = doc(
    collection(firestore, COLLECTION_WORLDS),
    worldId
  ).withConverter<WithId<World>>(withIdConverter());

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
