import React, { useMemo } from "react";

import { useSelector } from "hooks/useSelector";
import { useFirestoreConnect } from "react-redux-firebase";

import { Container, SubVenueIconMap } from "./Container";
import { ExtractProps } from "types/utility";
import { PLAYA_ICON_SIDE } from "settings";

type PropsType = Omit<ExtractProps<typeof Container>, "otherIcons"> & {
  venueId?: string;
};

export const PlayaContainer: React.FC<PropsType> = (props) => {
  const { venueId, ...rest } = props;
  useFirestoreConnect({
    collection: "venues",
    storeAs: "playaVenues",
  });

  const venues = useSelector((state) => state.firestore.ordered.playaVenues);

  const placedVenues: SubVenueIconMap = useMemo(() => {
    return (
      venues
        ?.filter((v) => v.placement?.x && v.placement?.y)
        .filter((v) => v.id !== venueId)
        .reduce((acc, v) => {
          return {
            ...acc,
            [v.id]: {
              width: PLAYA_ICON_SIDE,
              height: PLAYA_ICON_SIDE,
              top: v.placement?.y,
              left: v.placement?.x,
              url: v.mapIconImageUrl,
            },
          };
        }, {}) ?? {}
    );
  }, [venues, venueId]);

  return <Container {...rest} otherIcons={placedVenues} />;
};
