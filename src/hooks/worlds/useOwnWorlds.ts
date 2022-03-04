import { where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, DEFERRED, PATH } from "settings";

import { LoadStatus } from "types/fire";
import { WorldWithId } from "types/id";

import { useFireCollection } from "hooks/fire/useFireCollection";

type UseOwnWorlds = (options: {
  userId: string;
}) => LoadStatus & { ownWorlds: WorldWithId[] };

export const useOwnWorlds: UseOwnWorlds = ({ userId }) => {
  const {
    data: ownWorlds = ALWAYS_EMPTY_ARRAY,
    isLoaded,
    isLoading,
    error,
  } = useFireCollection<WorldWithId>({
    path: PATH.worlds,
    constraints: userId
      ? [
          where("isHidden", "==", false),
          where("owners", "array-contains", userId),
        ]
      : DEFERRED,
  });

  return { ownWorlds, isLoading, isLoaded, error };
};
