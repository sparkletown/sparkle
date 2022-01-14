import { useMemo } from "react";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES } from "settings";

import { ArtCar } from "types/animateMap";
import { ReactHook } from "types/utility";

import { convertToFirestoreKey } from "utils/id";

import { useRefiCollection } from "hooks/reactfire/useRefiCollection";

export const useArtcars: ReactHook<
  { animateMapId: string },
  { artcars: ArtCar[] }
> = ({ animateMapId }) => {
  const { data, isLoaded } = useRefiCollection<ArtCar>([
    COLLECTION_SPACES,
    convertToFirestoreKey(animateMapId),
    "artcars",
  ]);

  return useMemo(
    () => ({
      artcars: data ?? ALWAYS_EMPTY_ARRAY,
      isArtcarsLoaded: isLoaded,
    }),
    [data, isLoaded]
  );
};
