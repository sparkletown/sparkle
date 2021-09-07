import React from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import { DEFAULT_VENUE_BANNER, IFRAME_ALLOW_ADVANCED } from "settings";

import { EmbeddableVenue } from "types/venues";

import { useValidImage } from "hooks/useCheckImage";

import "./Embeddable.scss";

export interface EmbeddableProps {
  venue: EmbeddableVenue;
}

export const Embeddable: React.FC<EmbeddableProps> = ({ venue }) => {
  const { iframeUrl, containerStyles, iframeStyles, iframeOptions } = venue;
  const [validBannerImageUrl] = useValidImage(
    venue?.config?.landingPageConfig?.coverImageUrl,
    DEFAULT_VENUE_BANNER
  );
  const containerVars = useCss({
    background: `url(${validBannerImageUrl})`,
  });

  const containerClasses = classNames("embeddable", containerVars);

  if (!iframeUrl) return <p>Error: iframeUrl is missing</p>;

  return (
    <div className={containerClasses} style={containerStyles}>
      <div className="embeddable__background" />
      <iframe
        title="embeddable-iframe"
        src={iframeUrl}
        className="embeddable__iframe"
        style={iframeStyles}
        allow={IFRAME_ALLOW_ADVANCED}
        allowFullScreen
        {...iframeOptions}
      />
    </div>
  );
};
