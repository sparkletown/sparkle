import React from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import { DEFAULT_VENUE_LOGO } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { adminNGSettingsUrl, adminNGVenueUrl } from "utils/url";

import { AdminShowcaseSubTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseSubTitle";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./AdminSpaceCard.scss";

export interface AdminSpaceCardProps {
  venue: WithId<AnyVenue>;
}

export const AdminSpaceCard: React.FC<AdminSpaceCardProps> = ({ venue }) => {
  const backgroundStyle = useCss({
    "background-image": `url(${venue.config?.landingPageConfig.coverImageUrl})`,
  });
  const backgroundClasses = classNames("AdminSpaceCard__bg", backgroundStyle);

  const logoStyle = useCss({
    "background-image": `url(${venue.host?.icon ?? DEFAULT_VENUE_LOGO})`,
  });
  const logoClasses = classNames("AdminSpaceCard__logo", logoStyle);

  return (
    <div className="AdminSpaceCard">
      <div className={backgroundClasses} />
      <div className="AdminSpaceCard__info">
        <div className={logoClasses} />
        <AdminShowcaseSubTitle>{venue.name}</AdminShowcaseSubTitle>
      </div>
      <ButtonNG linkTo={adminNGVenueUrl(venue.id)} variant="primary">
        Manage Space
      </ButtonNG>
      <ButtonNG linkTo={adminNGSettingsUrl(venue.id)} variant="primary">
        Advanced Settings
      </ButtonNG>
    </div>
  );
};
