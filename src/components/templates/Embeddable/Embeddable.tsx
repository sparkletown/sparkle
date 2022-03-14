import React from "react";

import { IFRAME_ALLOW_ADVANCED } from "settings";

import { EmbeddableVenue } from "types/venues";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";

import { VenueWithOverlay } from "components/atoms/VenueWithOverlay/VenueWithOverlay";

import "./Embeddable.scss";

export interface EmbeddableProps {
  venue: EmbeddableVenue;
}

export const Embeddable: React.FC<EmbeddableProps> = ({ venue }) => {
  const { iframeUrl, autoPlay, iframeOptions } = venue;

  if (!iframeUrl) return <p>Error: iframeUrl is missing</p>;

  return (
    <VenueWithOverlay venue={venue} containerClassNames="embeddable">
      <iframe
        title="embeddable-iframe"
        src={convertToEmbeddableUrl({ url: iframeUrl, autoPlay })}
        className="embeddable__iframe"
        allow={IFRAME_ALLOW_ADVANCED}
        allowFullScreen
        {...iframeOptions}
      />
    </VenueWithOverlay>
  );
};
