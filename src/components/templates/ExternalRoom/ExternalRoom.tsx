import React, { useEffect } from "react";

import { AnyVenue } from "types/venues";
import { WithId } from "utils/id";
import { openUrl } from "utils/url";

import "./ExternalRoom.scss";
import { SparkleLogo } from "components/atoms/SparkleLogo";

export interface ExternalRoomProps {
  venue: WithId<AnyVenue>;
}

export const ExternalRoom: React.FC<ExternalRoomProps> = ({ venue }) => {
  const redirectUrl = venue.zoomUrl;

  useEffect(() => {
    if (!redirectUrl) return;

    openUrl(redirectUrl);
  }, [redirectUrl]);

  return redirectUrl ? (
    <div className="ExternalRoom">
      <div className="ExternalRoom__message">
        <SparkleLogo />
        <div className="ExternalRoom__content">
          <h4 className="ExternalRoom__header">Thank you for visiting</h4>
          <a
            rel="noreferrer"
            href={venue.zoomUrl}
            target="_blank"
            className="ExternalRoom__link"
          >
            {venue.zoomUrl}
          </a>
        </div>
      </div>
    </div>
  ) : (
    <div className="ExternalRoom__message">
      <p>Venue {venue.name} should redirect to a URL, but none was set.</p>
    </div>
  );
};
