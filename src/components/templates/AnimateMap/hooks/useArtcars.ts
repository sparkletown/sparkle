import { useMemo } from "react";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES } from "settings";

import { ArtCar } from "types/animateMap";

import { convertToFirestoreKey } from "utils/id";

import { useRefiCollection } from "hooks/fire/useRefiCollection";

export const useArtcars: (options: {
  animateMapId: string;
}) => { artcars: ArtCar[] } = ({ animateMapId }) => {
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
