import React, { useEffect } from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { openUrl } from "utils/url";

import CN from "./ExternalRoom.module.scss";

export interface ExternalRoomProps {
  venue: WithId<AnyVenue>;
}

export const ExternalRoom: React.FC<ExternalRoomProps> = ({ venue }) => {
  const redirectUrl = venue.zoomUrl ?? "";

  useEffect(() => {
    if (!redirectUrl) return;

    openUrl(redirectUrl);
  }, [redirectUrl]);

  return (
    <div
      className={CN.externalRoom}
      style={{
        background: `url(${venue.config?.landingPageConfig.coverImageUrl}) center center`,
      }}
    >
      <img src={venue.host?.icon} alt="Venue icon" className={CN.venueIcon} />
      <div className={CN.infoContainer}>
        <div className={CN.mainInfo}>
          <h1 className={CN.venueName}>{venue.name}</h1>
          <h2 className={CN.venueDescription}>
            {venue.config?.landingPageConfig.description}
          </h2>
        </div>
        <div className={CN.secondaryInfo}>
          <p className={CN.redirectText}>
            Opened {venue.name} in a new tab <br />
            <a href={redirectUrl} target="_blank" rel="noreferrer">
              {redirectUrl}
            </a>
            <br />
            <br />
            Doesn&apos;t work? Try enabling pop ups on your browser <br />
            and click{" "}
            <a href={redirectUrl} target="_blank" rel="noreferrer">
              here
            </a>{" "}
            to try again.
          </p>
        </div>
      </div>
    </div>
  );
};
