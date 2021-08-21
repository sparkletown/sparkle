import { useMemo } from "react";

import { Firebarrel } from "types/animateMap";
import { ReactHook } from "types/utility";

import { animateMapFirebarrelsSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

export interface UseFirebarrelProps {
  animateMapId: string;
}

export interface UseFirebarrelData {
  firebarrels: Firebarrel[];
}

const useFirebarrelsConnect = (animateMapId: string) => {
  useFirestoreConnect([
    {
      collection: "venues",
      doc: animateMapId,
      subcollections: [{ collection: "firebarrels" }],
      storeAs: "animatemapFirebarrels",
    },
  ]);
};

const emptyAnimateMapFirebarrelsArray: Firebarrel[] = [];

export const useFirebarrels: ReactHook<
  UseFirebarrelProps,
  UseFirebarrelData
> = ({ animateMapId }) => {
  useFirebarrelsConnect(animateMapId);

  const firebarrels = useSelector(animateMapFirebarrelsSelector);

  return useMemo(
    () => ({
      firebarrels: firebarrels ?? emptyAnimateMapFirebarrelsArray,
      isFirebarrelsLoaded: isLoaded(firebarrels),
    }),
    [firebarrels]
  );
};
