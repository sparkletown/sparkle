import React, { useEffect } from "react";

import { EXTERNAL_LINK_BACKGROUND } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { openUrl } from "utils/url";

import { useWorldUsers } from "hooks/users";

import { LogoRF } from "pages/RegistrationFlow/LogoRF";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { UserList } from "components/molecules/UserList";

import "./ExternalRoom.scss";

export interface ExternalRoomProps {
  venue: WithId<AnyVenue>;
}

export const ExternalRoom: React.FC<ExternalRoomProps> = ({ venue }) => {
  const redirectUrl = venue.zoomUrl;

  useEffect(() => {
    if (!redirectUrl) return;

    // openUrl(redirectUrl);
  }, [redirectUrl]);

  const { worldUsers } = useWorldUsers();

  return (
    <div
      className="ExternalRoom"
      style={{ backgroundImage: `url(${EXTERNAL_LINK_BACKGROUND})` }}
    >
      <LogoRF />
      {!redirectUrl && (
        <div className="ExternalRoom__message">
          Venue {venue.name} should redirect to a URL, but none was set.
        </div>
      )}

      {redirectUrl && (
        <>
          <div className="ExternalRoom__message">
            <div>This page should automatically open</div>
            <a rel="noreferrer" href={redirectUrl} target="_blank">
              {redirectUrl}
            </a>

            <div>
              in a new tab. If {`you're`} not seeing this, try{" "}
              <a
                rel="noreferrer"
                href="https://support.google.com/chrome/answer/95472?hl=en&co=GENIE.Platform%3DDesktop"
                target="_blank"
              >
                enabling pop ups on your browser.
              </a>
            </div>
          </div>
          <div className="ExternalRoom__content">
            <div className="ExternalRoom__venue-container">
              <div
                className="ExternalRoom__venue-logo"
                style={{ backgroundImage: `url(${venue.host?.icon})` }}
              />

              <div className="ExternalRoom__venue-details">
                <div className="ExternalRoom__venue-title">{venue.name}</div>

                <div className="ExternalRoom__venue-subtitle">
                  {venue.config?.landingPageConfig.subtitle}
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => openUrl(redirectUrl)}
                >
                  Enter
                </button>
              </div>
            </div>

            <div className="ExternalRoom__venue-description">
              <RenderMarkdown
                text={venue.config?.landingPageConfig.description}
              />
            </div>

            <UserList
              containerClassName="ExternalRoom__userlist"
              users={worldUsers}
              limit={11}
              activity="in here"
              hasClickableAvatars
            />
          </div>
        </>
      )}
    </div>
  );
};
