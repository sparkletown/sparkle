import { useMemo } from "react";

import { ArtCar } from "types/animateMap";
import { ReactHook } from "types/utility";

import { animateMapArtCarsSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

export interface UseArtcarProps {
  animateMapId: string;
}

export interface UseArtcarData {
  artcars: ArtCar[];
}

const useArtcarsConnect = (animateMapId: string) => {
  useFirestoreConnect([
    {
      collection: "venues",
      doc: animateMapId,
      subcollections: [{ collection: "artcars" }],
      storeAs: "animatemapArtcars",
    },
  ]);
};

const emptyAnimateMapArtcarsArray: ArtCar[] = [];

export const useArtcars: ReactHook<UseArtcarProps, UseArtcarData> = ({
  animateMapId,
}) => {
  useArtcarsConnect(animateMapId);

  const artcars = useSelector(animateMapArtCarsSelector);

  return useMemo(
    () => ({
      artcars: artcars ?? emptyAnimateMapArtcarsArray,
      isArtcarsLoaded: isLoaded(artcars),
    }),
    [artcars]
  );
};
