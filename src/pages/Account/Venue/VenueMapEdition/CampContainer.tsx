import React, { useMemo } from "react";

import { ExtractProps } from "types/utility";
import { CampVenue } from "types/venues";

import { Container, SubVenueIconMap } from "./Container";

type PropsType = Omit<ExtractProps<typeof Container>, "otherIcons"> & {
  venue: CampVenue;
  currentRoomIndex?: number;
};

export const CampContainer: React.FC<PropsType> = (props) => {
  const { currentRoomIndex, venue, ...rest } = props;

  const otherIcons: SubVenueIconMap = useMemo(() => {
    return (
      venue.rooms
        ?.filter((r, idx) => idx !== currentRoomIndex)
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
  }, [venue, currentRoomIndex]);

  return <Container {...rest} otherIcons={otherIcons} />;
};
