import React, { useEffect } from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { openUrl } from "utils/url";

import styles from "./ExternalRoom.module.scss";

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
      className={styles.ExternalRoom}
      style={{
        background: `url(${venue.config?.landingPageConfig.coverImageUrl}) center center`,
      }}
    >
      <img
        src={venue.host?.icon}
        alt="Venue icon"
        className={styles.VenueIcon}
      />
      <div className={styles.InfoContainer}>
        <div className={styles.MainInfo}>
          <h1 className={styles.VenueName}>{venue.name}</h1>
          <h2 className={styles.VenueDescription}>
            {venue.config?.landingPageConfig.description}
          </h2>
        </div>
        <div className={styles.SecondaryInfo}>
          <p className={styles.RedirectText}>
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
