import React, { useMemo } from "react";
import { Room } from "types/rooms";

import { ExtractProps } from "types/utility";

import { Container, SubVenueIconMap } from "./Container";

type PartyMapContainerProps = Omit<
  ExtractProps<typeof Container>,
  "otherIcons"
> & {
  rooms: Room[];
  currentRoomIndex?: number;
};

export const PartyMapContainer: React.FC<PartyMapContainerProps> = (props) => {
  const { currentRoomIndex, rooms, ...rest } = props;

  const otherIcons: SubVenueIconMap = useMemo(() => {
    return (
      rooms
        ?.filter((r, index) => index !== currentRoomIndex)
        .reduce((acc, r) => {
          return {
            ...acc,
            [r.title]: {
              width: r.width_percent,
              height: r.height_percent,
              top: r.y_percent,
              left: r.x_percent,
              url: r.image_url,
            },
          };
        }, {}) ?? {}
    );
  }, [rooms, currentRoomIndex]);

  return <Container {...rest} otherIcons={otherIcons} />;
};
