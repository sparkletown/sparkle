import React, { useEffect } from "react";

import { AnyVenue } from "types/venues";
import { WithId } from "utils/id";
import { openUrl } from "utils/url";

import { Logo } from "components/atoms/Logo";

import "./ExternalRoom.scss";

export interface ExternalRoomProps {
  venue: WithId<AnyVenue>;
}

export const ExternalRoom: React.FC<ExternalRoomProps> = ({ venue }) => {
  const redirectUrl = venue.zoomUrl;

  useEffect(() => {
    if (!redirectUrl) return;

    openUrl(redirectUrl);
  }, [redirectUrl]);

  if (venue.zoomUrl) {
    return (
      <div className="ExternalRoom">
        <div className="ExternalRoom__MessageBox">
          <Logo height={"110px"} width={"130px"} />
          <h4 className="ExternalRoom__Header">Thank your for visting</h4>
          <a rel="noreferrer" href={venue.zoomUrl} target="_blank">
            {venue.zoomUrl}
          </a>
        </div>
      </div>
    );
  } else {
    return (
      <div className="ExternalRoom__message">
        <p>Venue {venue.name} should redirect to a URL, but none was set.</p>
      </div>
    );
  }
};
