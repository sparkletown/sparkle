import { useMemo } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";

import { World } from "api/admin";

import { ReactHook } from "types/utility";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

interface UseCurrentWorldProps {
  worldId?: string;
}

interface UseCurrentWorldReturn {
  isLoaded: boolean;
  world?: WithId<World>;
}

export const useCurrentWorld: ReactHook<
  UseCurrentWorldProps,
  UseCurrentWorldReturn
> = ({ worldId }) => {
  const firestore = useFirestore();
  const worldRef = firestore
    .collection("worlds")
    .doc(worldId)
    .withConverter(withIdConverter);

  const { data: world, status } = useFirestoreDocData<WithId<World>>(worldRef);

  const isWorldLoaded = status !== "loading";

  return useMemo(
    () => ({
      world: world,
      isLoaded: isWorldLoaded,
    }),
    [isWorldLoaded, world]
  );
};
