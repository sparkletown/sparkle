import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection, query, where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_WORLDS } from "settings";

import { World } from "api/world";

import { CONVERTER_WORLD_WITH_ID } from "utils/converters";
import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

export const useOwnWorlds = (): WithId<World>[] => {
  const firestore = useFirestore();
  const { userId } = useUser();

  const ownWorldsRef = query(
    collection(firestore, COLLECTION_WORLDS),
    where("isHidden", "==", false),
    where("owners", "array-contains", userId ?? "")
  ).withConverter(CONVERTER_WORLD_WITH_ID);

  const { data: ownWorlds } = useFirestoreCollectionData<WithId<World>>(
    ownWorldsRef,
    {
      initialData: ALWAYS_EMPTY_ARRAY,
    }
  );

  return ownWorlds;
};
