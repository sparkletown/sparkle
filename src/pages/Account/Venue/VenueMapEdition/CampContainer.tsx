import React, { useMemo } from "react";

import { Container } from "./Container";
import { CampVenue } from "types/CampVenue";
import { ExtractProps } from "types/utility";

export interface SubVenueIconMap {
  [key: string]: { top: number; left: number; url: string };
}

type PropsType = Omit<ExtractProps<typeof Container>, "otherIcons"> & {
  venue: CampVenue;
};

export const CampContainer: React.FC<PropsType> = (props) => {
  const { venue, ...rest } = props;

  const otherIcons: SubVenueIconMap = useMemo(() => {
    return (
      venue.rooms?.reduce((acc, r) => {
        return {
          ...acc,
          [r.title]: {
            top: r.y_percent,
            left: r.x_percent,
            url: r.image_url,
          },
        };
      }, {}) ?? {}
    );
  }, [venue]);

  return <Container {...rest} otherIcons={otherIcons} />;
};
