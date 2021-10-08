import { useFirestore, useFirestoreCollectionData } from "reactfire";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { World } from "api/admin";

import { worldConverter } from "utils/converters";
import { WithId } from "utils/id";

export const useOwnWorlds = (userId?: string): WithId<World>[] => {
  const firestore = useFirestore();
  const worldsRef = firestore
    .collection("worlds")
    .where("owners", "array-contains", userId)
    .withConverter(worldConverter);

  const { data: worlds } = useFirestoreCollectionData<WithId<World>>(
    worldsRef,
    {
      initialData: ALWAYS_EMPTY_ARRAY,
    }
  );

  return worlds;
};
