import React, { useEffect } from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import {
  ENABLE_POPUPS_URL,
  EXTERNAL_ROOM_BACKGROUND,
  USER_AVATAR_LIMIT,
} from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { openUrl } from "utils/url";

import { useRecentVenueUsers } from "hooks/users";

import { LogoRF } from "pages/RegistrationFlow/LogoRF";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { UserList } from "components/molecules/UserList";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./ExternalRoom.scss";

export interface ExternalRoomProps {
  venue: WithId<AnyVenue>;
}

export const ExternalRoom: React.FC<ExternalRoomProps> = ({ venue }) => {
  const redirectUrl = venue.zoomUrl;

  const containerVars = useCss({
    "background-image": `url(${EXTERNAL_ROOM_BACKGROUND})`,
  });

  const { recentVenueUsers } = useRecentVenueUsers({ venueName: venue.name });

  const containerClasses = classNames("ExternalRoom", containerVars);

  const venueLogoVars = useCss({
    "background-image": `url(${venue.host?.icon})`,
  });

  const venueLogoClasses = classNames(
    "ExternalRoom__venue-logo",
    venueLogoVars
  );

  useEffect(() => {
    if (!redirectUrl) return;
    openUrl(redirectUrl);
  }, [redirectUrl]);

  return (
    <div className={containerClasses}>
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
            <a
              rel="noreferrer"
              href={redirectUrl}
              target="_blank"
              className="ExternalRoom__link"
            >
              {redirectUrl}
            </a>

            <div>
              in a new tab. If you&apos;re not seeing this, try{" "}
              <a rel="noreferrer" href={ENABLE_POPUPS_URL} target="_blank">
                enabling pop ups on your browser.
              </a>
            </div>
          </div>
          <div className="ExternalRoom__content">
            <div className="ExternalRoom__venue-container">
              <div className={venueLogoClasses} />

              <div className="ExternalRoom__venue-details">
                <div className="ExternalRoom__venue-title">{venue.name}</div>

                <div className="ExternalRoom__venue-subtitle">
                  {venue.config?.landingPageConfig.subtitle}
                </div>

                <ButtonNG
                  variant="primary"
                  onClick={() => openUrl(redirectUrl)}
                >
                  Enter
                </ButtonNG>
              </div>
            </div>

            <div className="ExternalRoom__venue-description">
              <RenderMarkdown
                text={venue.config?.landingPageConfig.description}
              />
            </div>

            <UserList
              containerClassName="ExternalRoom__userlist"
              users={recentVenueUsers}
              limit={USER_AVATAR_LIMIT}
              activity="in here"
              hasClickableAvatars
            />
          </div>
        </>
      )}
    </div>
  );
};
