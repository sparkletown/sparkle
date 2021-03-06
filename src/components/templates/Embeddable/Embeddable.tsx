import React from "react";

import { EmbeddableVenue, Venue } from "types/venues";

import "./Embeddable.scss";

export interface EmbeddableProps {
  venue: Venue;
}

export const Embeddable: React.FC<EmbeddableProps> = ({ venue }) => {
  const typedVenue = venue as EmbeddableVenue;

  if (!typedVenue?.iframeUrl) return <p>iframeUrl is missing</p>;

  return (
    <div className="embeddable" style={typedVenue.containerStyles}>
      <iframe
        title="embeddable-iframe"
        src={typedVenue.iframeUrl}
        className="embeddable__iframe"
        style={typedVenue.iframeStyles}
        {...typedVenue.iframeOptions}
      ></iframe>
    </div>
  );
};
