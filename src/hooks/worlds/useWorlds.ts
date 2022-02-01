import { useFirestore, useFirestoreCollectionData } from "reactfire";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { World } from "api/world";

import { worldConverter } from "utils/converters";
import { WithId } from "utils/id";

export const useWorlds = (): WithId<World>[] => {
  const firestore = useFirestore();
  const worldsRef = firestore
    .collection("worlds")
    .where("isHidden", "==", false)
    .withConverter(worldConverter);

  const { data: worlds } = useFirestoreCollectionData<WithId<World>>(
    worldsRef,
    {
      initialData: ALWAYS_EMPTY_ARRAY,
    }
  );

  return worlds;
};
