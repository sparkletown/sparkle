import { useMemo } from "react";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES } from "settings";

import { convertToFirestoreKey } from "utils/id";

import { useRefiCollection } from "hooks/fire/useRefiCollection";

import { AnimateMapFirebarrelData } from "../AnimateMapFirebarrelData";

type UseFirebarrels = (options: {
  animateMapId: string;
}) => { firebarrels: AnimateMapFirebarrelData[] };

export const useFirebarrels: UseFirebarrels = ({ animateMapId }) => {
  const { data, isLoaded } = useRefiCollection<AnimateMapFirebarrelData>([
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
