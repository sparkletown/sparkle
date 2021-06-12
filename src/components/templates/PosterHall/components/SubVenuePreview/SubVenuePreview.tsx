import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { enterVenue } from "utils/url";

import { useRelatedVenues } from "hooks/useRelatedVenues";

import "./SubVenuePreview.scss";

export interface SubVenuePreviewProps {
  venueId: string;
  title: string;
  host: string;
}

export const SubVenuePreview: React.FC<SubVenuePreviewProps> = ({
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
    <div className="SubVenuePreview" onClick={handleEnterVenue}>
      {venueName && <p className="SubVenuePreview__venue">{venueName}</p>}

      <p className="SubVenuePreview__title">{title}</p>

      <div className="SubVenuePreview__author">{host}</div>
    </div>
  );
};
