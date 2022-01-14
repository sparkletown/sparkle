import { useMemo } from "react";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES } from "settings";

import { Firebarrel } from "types/animateMap";
import { ReactHook } from "types/utility";

import { convertToFirestoreKey } from "utils/id";

import { useRefiCollection } from "hooks/reactfire/useRefiCollection";

type UseFirebarrels = ReactHook<
  { animateMapId: string },
  { firebarrels: Firebarrel[] }
>;

export const useFirebarrels: UseFirebarrels = ({ animateMapId }) => {
  const { data, isLoaded } = useRefiCollection<Firebarrel>([
    COLLECTION_SPACES,
    convertToFirestoreKey(animateMapId),
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
