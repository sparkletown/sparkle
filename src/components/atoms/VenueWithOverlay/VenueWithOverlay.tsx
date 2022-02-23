import React from "react";
import classNames from "classnames";

import { DEFAULT_VENUE_BANNER_COLOR } from "settings";

import { AnyVenue, EmbeddableVenue } from "types/venues";

import { WithId } from "utils/id";

import { useValidImage } from "hooks/useCheckImage";

import "./VenueWithOverlay.scss";

type VenueWithOverlayProps = {
  containerClassNames: string;
  venue: WithId<AnyVenue> | EmbeddableVenue;
  style?: React.CSSProperties;
};

export const VenueWithOverlay: React.FC<VenueWithOverlayProps> = ({
  children,
  containerClassNames,
  venue,
  style,
}) => {
  // TODO use it or delete it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [validBannerImageUrl] = useValidImage(
    venue?.config?.landingPageConfig?.coverImageUrl ||
      venue?.config?.landingPageConfig?.bannerImageUrl,
    DEFAULT_VENUE_BANNER_COLOR
  );

  const containerClasses = classNames(containerClassNames);

  return (
    <div className={containerClasses} style={style}>
      <div className="VenueWithOverlay" />
      {children}
    </div>
  );
};
