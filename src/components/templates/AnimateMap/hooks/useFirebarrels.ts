import { useMemo } from "react";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES, DEFERRED } from "settings";

import { Firebarrel } from "types/animateMap";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

type UseFirebarrels = (options: {
  animateMapId: string;
}) => { firebarrels: Firebarrel[] };

export const useFirebarrels: UseFirebarrels = ({ animateMapId }) => {
  const { data, isLoaded } = useLiveCollection<Firebarrel>([
    COLLECTION_SPACES,
    animateMapId || DEFERRED,
    "firebarrels",
  ]);

  return useMemo(
    () => ({
      firebarrels: data ?? ALWAYS_EMPTY_ARRAY,
      isFirebarrelsLoaded: isLoaded,
    }),
    [data, isLoaded]
  );
};
