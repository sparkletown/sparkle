import React from "react";

import { EmbeddableVenue } from "types/venues";

import "./Embeddable.scss";

export interface EmbeddableProps {
  venue: EmbeddableVenue;
}

export const Embeddable: React.FC<EmbeddableProps> = ({ venue }) => {
  if (!venue?.iframeUrl) return <p>Error: iframeUrl is missing</p>;

  return (
    <div className="embeddable" style={venue.containerStyles}>
      <iframe
        title="embeddable-iframe"
        src={venue.iframeUrl}
        className="embeddable__iframe"
        style={venue.iframeStyles}
        {...venue.iframeOptions}
      ></iframe>
    </div>
  );
};
