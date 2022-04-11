import React from "react";
import classNames from "classnames";

import { SpaceWithId } from "types/id";
import { EmbeddableVenue } from "types/venues";

import "./VenueWithOverlay.scss";

type VenueWithOverlayProps = {
  containerClassNames: string;
  venue: SpaceWithId | EmbeddableVenue;
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
