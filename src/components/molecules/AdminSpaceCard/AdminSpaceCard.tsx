import React from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import { DEFAULT_VENUE_LOGO, SPACE_TAXON } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { adminNGSettingsUrl, adminNGVenueUrl } from "utils/url";

import { AdminShowcaseSubTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseSubTitle";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./AdminSpaceCard.scss";

export interface AdminSpaceCardProps {
  venue: WithId<AnyVenue>;
  worldSlug?: string;
}

export const AdminSpaceCard: React.FC<AdminSpaceCardProps> = ({
  venue,
  worldSlug,
}) => {
  const backgroundStyle = useCss({
    "background-image": `url(${venue.mapBackgroundImageUrl})`,
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
      <ButtonNG
        linkTo={adminNGVenueUrl(worldSlug, venue.slug)}
        disabled={!venue.slug}
      >
        Manage {SPACE_TAXON.capital} Settings
      </ButtonNG>
      <ButtonNG linkTo={adminNGSettingsUrl(venue.slug)} disabled={!venue.slug}>
        {SPACE_TAXON.capital} Settings
      </ButtonNG>
    </div>
  );
};
