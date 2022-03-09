import React from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

// import { openUrl } from "utils/url";
import styles from "./ExternalRoom.module.scss";

export interface ExternalRoomProps {
  venue: WithId<AnyVenue>;
}

export const ExternalRoom: React.FC<ExternalRoomProps> = ({ venue }) => {
  const redirectUrl = venue.zoomUrl ?? "";

  // useEffect(() => {
  // if (!redirectUrl) return;
  // openUrl(redirectUrl);
  // }, [redirectUrl]);

  // const openRoomUrl = useCallback(() => openUrl(redirectUrl), [redirectUrl]);

  // venue.name
  // venue.config?.landingPageConfig.subtitle
  // venue.config?.landingPageConfig.description

  return (
    <div className={styles.ExternalRoom}>
      {/* {!redirectUrl && (
          <div className="ExternalRoom__container">
            <div className="ExternalRoom__message">
              Venue {venue.name} should redirect to a URL, but none was set.
            </div>
          </div>
        )} */}
      <img src={venue.host?.icon} alt="Venue icon" />
      <h1>{venue.name}</h1>
      <p className={styles.RedirectText}>
        This page should automatically open <br />
        <a href={redirectUrl}>{redirectUrl}</a> <br />
        in a new tab.If you&apos;re not seeing this, try enabling pop ups on
        your browser.
      </p>
    </div>
  );
};
