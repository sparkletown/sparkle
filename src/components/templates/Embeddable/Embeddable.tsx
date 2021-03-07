import React from "react";

import { EmbeddableVenue } from "types/venues";

import "./Embeddable.scss";

export interface EmbeddableProps {
  venue: EmbeddableVenue;
}

export const Embeddable: React.FC<EmbeddableProps> = ({ venue }) => {
  const { iframeUrl, containerStyles, iframeStyles, iframeOptions } = venue;

  if (!iframeUrl) return <p>Error: iframeUrl is missing</p>;

  return (
    <div className="embeddable" style={containerStyles}>
      <iframe
        title="embeddable-iframe"
        src={iframeUrl}
        className="embeddable__iframe"
        style={iframeStyles}
        {...iframeOptions}
      />
    </div>
  );
};
