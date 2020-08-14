import React, { CSSProperties, useMemo } from "react";

import { useSelector } from "hooks/useSelector";
import { useFirestoreConnect } from "react-redux-firebase";

import { Container } from "./Container";

interface SubVenueIconMap {
  [key: string]: { top: number; left: number; url: string };
}

interface PropsType {
  snapToGrid: boolean;
  iconsMap: SubVenueIconMap;
  backgroundImage: string;
  iconImageStyle: CSSProperties;
  onChange: (val: SubVenueIconMap) => void;
  venueId?: string;
  coordinatesBoundary: number;
}

export const PlayaContainer: React.FC<PropsType> = (props) => {
  const { venueId, ...rest } = props;
  useFirestoreConnect("venues");
  const venues = useSelector((state) => state.firestore.ordered.venues);

  const placedVenues: SubVenueIconMap = useMemo(() => {
    return (
      venues
        ?.filter((v) => v.placement?.x && v.placement?.y)
        .filter((v) => v.id !== venueId)
        .reduce((acc, v) => {
          return {
            ...acc,
            [v.id]: {
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
