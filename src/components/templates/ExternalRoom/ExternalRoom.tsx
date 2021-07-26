import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { AnyVenue } from "types/venues";
import { WithId } from "utils/id";
import { openUrl } from "utils/url";

import "./ExternalRoom.scss";

export interface ExternalRoomProps {
  venue: WithId<AnyVenue>;
}

export const ExternalRoom: React.FC<ExternalRoomProps> = ({ venue }) => {
  const history = useHistory();
const redirectUrl = venue.zoomUrl;

  useEffect(() => {
    if (!redirectUrl) return;
    
    openUrl(redirectUrl);
  }, [redirectUrl]);

  if (venue.zoomUrl) {
    return (
      <div className="ExternalRoom__message">
        <h4>
          Please keep this tab open while you are directed to external content.
        </h4>
        <h4>Return to this tab when you are ready to explore some more!</h4>
        <a rel="noreferrer" href={venue.zoomUrl} target="_blank">
          Open room manually
        </a>
      </div>
    );
  } else {
    return (
      <p>
        Venue {venue.name} should redirect to a URL, but none was set.
        <br />
        <button
          role="link"
          className="btn btn-primary"
          onClick={() => history.goBack()}
        >
          Go Back
        </button>
      </p>
    );
  }
};
