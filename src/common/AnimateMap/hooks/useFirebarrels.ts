import { useMemo } from "react";
import { AnimateMapFirebarrel } from "common/AnimateMapCommon/AnimateMapFirebarrel";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES } from "settings";

import { convertToFirestoreKey } from "utils/id";

import { useRefiCollection } from "hooks/fire/useRefiCollection";

type UseFirebarrels = (options: {
  animateMapId: string;
}) => { firebarrels: AnimateMapFirebarrel[] };

export const useFirebarrels: UseFirebarrels = ({ animateMapId }) => {
  const { data, isLoaded } = useRefiCollection<AnimateMapFirebarrel>([
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
