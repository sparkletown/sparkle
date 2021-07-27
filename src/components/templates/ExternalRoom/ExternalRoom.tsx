import React, { useEffect } from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { openUrl } from "utils/url";

import { SparkleLogo } from "components/atoms/SparkleLogo";

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

  return redirectUrl ? (
    <div className="ExternalRoom">
      <div className="ExternalRoom__message">
        <SparkleLogo />
        <div className="ExternalRoom__content">
          <h4 className="ExternalRoom__header">
            You will now be redirected to some incredible content! Please ensure
            you{" "}
            <a
              rel="noreferrer"
              href="https://support.google.com/chrome/answer/95472?hl=en&co=GENIE.Platform%3DDesktop"
              target="_blank"
            >
              allow popups in your browser
            </a>{" "}
            and keep this tab open while you explore, so you can find your way
            back easily. If you do not see a new tab open, please feel free to{" "}
            <a rel="noreferrer" href={venue.zoomUrl} target="_blank">
              click here
            </a>
            .
          </h4>
        </div>
      </div>
    </div>
  ) : (
    <div className="ExternalRoom__message">
      <p>Venue {venue.name} should redirect to a URL, but none was set.</p>
    </div>
  );
};
