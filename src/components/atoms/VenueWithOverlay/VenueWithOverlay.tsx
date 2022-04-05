import React from "react";
import classNames from "classnames";

import { AnyVenue, EmbeddableVenue } from "types/venues";

import { WithId } from "utils/id";

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
  const containerClasses = classNames(containerClassNames);

  return (
    <div className={containerClasses} style={style}>
      <div className="VenueWithOverlay" />
      {children}
    </div>
  );
};
