import React from "react";

import { IFRAME_ALLOW_ADVANCED } from "settings";

import { EmbeddableVenue } from "types/venues";

import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";

import "./Embeddable.scss";

export interface EmbeddableProps {
  venue: EmbeddableVenue;
}

export const Embeddable: React.FC<EmbeddableProps> = ({ venue }) => {
  const {
    iframeUrl,
    autoPlay,
    containerStyles,
    iframeStyles,
    iframeOptions,
  } = venue;

  if (!iframeUrl) return <p>Error: iframeUrl is missing</p>;

  return (
    <div className="embeddable" style={containerStyles}>
      <iframe
        title="embeddable-iframe"
        src={ConvertToEmbeddableUrl(iframeUrl, autoPlay)}
        className="embeddable__iframe"
        style={iframeStyles}
        allow={IFRAME_ALLOW_ADVANCED}
        allowFullScreen
        {...iframeOptions}
      />
    </div>
  );
};
