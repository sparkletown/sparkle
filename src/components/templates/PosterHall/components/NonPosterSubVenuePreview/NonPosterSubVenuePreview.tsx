import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { enterVenue } from "utils/url";

import { useRelatedVenues } from "hooks/useRelatedVenues";

import "./NonPosterSubVenuePreview.scss";

export interface NonPosterSubVenuePreviewProps {
  venueId: string;
  title: string;
  host: string;
}

export const NonPosterSubVenuePreview: React.FC<NonPosterSubVenuePreviewProps> = ({
  venueId,
  title,
  host,
}) => {
  const { push: openUrlUsingRouter } = useHistory();
  const handleEnterVenue = useCallback(
    () => enterVenue(venueId, { customOpenRelativeUrl: openUrlUsingRouter }),
    [venueId, openUrlUsingRouter]
  );

  const { currentVenue } = useRelatedVenues({
    currentVenueId: venueId,
  });
  const venueName = currentVenue?.name;

  return (
    <div className="NonPosterSubVenuePreview" onClick={handleEnterVenue}>
      {venueName && (
        <p className="NonPosterSubVenuePreview__venue">{venueName}</p>
      )}

      <p className="NonPosterSubVenuePreview__title">{title}</p>

      <div className="NonPosterSubVenuePreview__author">{host}</div>
    </div>
  );
};
