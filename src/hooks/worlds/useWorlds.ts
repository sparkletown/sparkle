import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection, query, where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_WORLDS } from "settings";

import { World } from "api/world";

import { CONVERTER_WORLD_WITH_ID } from "utils/converters";
import { WithId } from "utils/id";

export const useWorlds = (): WithId<World>[] => {
  const firestore = useFirestore();
  const worldsRef = query(
    collection(firestore, COLLECTION_WORLDS),
    where("isHidden", "==", false)
  ).withConverter(CONVERTER_WORLD_WITH_ID);

  const { data: worlds } = useFirestoreCollectionData<WithId<World>>(
    worldsRef,
    {
      initialData: ALWAYS_EMPTY_ARRAY,
    }
  );

  return worlds;
};
