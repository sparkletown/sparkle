import React from "react";

import { IFRAME_ALLOW_ADVANCED } from "settings";

import { EmbeddableVenue } from "types/venues";

import { convertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";

import { VenueWithOverlay } from "components/atoms/VenueWithOverlay/VenueWithOverlay";

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
    <VenueWithOverlay
      venue={venue}
      containerName="embeddable"
      style={containerStyles}
    >
      <iframe
        title="embeddable-iframe"
        src={convertToEmbeddableUrl({ url: iframeUrl, autoPlay })}
        className="embeddable__iframe"
        style={iframeStyles}
        allow={IFRAME_ALLOW_ADVANCED}
        allowFullScreen
        {...iframeOptions}
      />
    </VenueWithOverlay>
  );
};
