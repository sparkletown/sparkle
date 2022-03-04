import { collection, getFirestore, query, where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_WORLDS } from "settings";

import { World } from "api/world";

import { WorldId, WorldWithId } from "types/id";

import { withIdConverter } from "utils/converters";

import { useFireQuery } from "hooks/fire/useFireQuery";

export const useWorlds = (): WorldWithId[] => {
  const { data: worlds = ALWAYS_EMPTY_ARRAY } = useFireQuery<WorldWithId>(
    query(
      collection(getFirestore(), COLLECTION_WORLDS),
      where("isHidden", "==", false)
    ).withConverter(withIdConverter<World, WorldId>())
  );

  return worlds;
};
