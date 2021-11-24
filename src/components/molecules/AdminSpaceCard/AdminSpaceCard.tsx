import React from "react";
import { Link } from "react-router-dom";
import { useCss } from "react-use";
import { faLink, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { DEFAULT_VENUE_LOGO, SPACE_PORTALS_ICONS_MAPPING } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { adminNGVenueUrl } from "utils/url";

import { AdminShowcaseSubTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseSubTitle";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./AdminSpaceCard.scss";

export interface AdminSpaceCardProps {
  venue: WithId<AnyVenue>;
}

export const AdminSpaceCard: React.FC<AdminSpaceCardProps> = ({ venue }) => {
  console.log(venue);
  const backgroundStyle = useCss({
    background: `linear-gradient(
        rgba(25, 24, 26, 0.6),
        rgba(25, 24, 26, 0.6)
      ), url('https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg')`,
    // "background": `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg')`,
  });
  const backgroundClasses = classNames("AdminSpaceCard__bg", backgroundStyle);

  const logoStyle = useCss({
    "background-image": `url(${venue.host?.icon ?? DEFAULT_VENUE_LOGO})`,
  });
  const logoClasses = classNames("AdminSpaceCard__logo", logoStyle);

  const spaceIcon = SPACE_PORTALS_ICONS_MAPPING[venue.template];

  return (
    <div className="AdminSpaceCard">
      <div className={backgroundClasses}>
        <div className="AdminSpaceCard__bg-container">
          <Link className="AdminSpaceCard__link" to="">
            {"Visit"}
            <FontAwesomeIcon
              className="AdminSpaceCard__link-icon"
              icon={faLink}
            />
          </Link>
          <div className="AdminSpaceCard__body">
            <div className={logoClasses} />
            <div className="AdminSpaceCard__body-info">
              <AdminShowcaseSubTitle>{venue.name}</AdminShowcaseSubTitle>
              <span className="AdminSpaceCard__text">
                <img
                  alt={`space-icon-${spaceIcon}`}
                  src={spaceIcon}
                  className="SpacesDropdown__item-icon"
                />
                {venue.template}
              </span>
              {venue.rooms?.length ? (
                <span className="AdminSpaceCard__text">{`${venue.rooms?.length} experiences`}</span>
              ) : null}
            </div>
          </div>
          <div className="AdminSpaceCard__user-count">
            <FontAwesomeIcon className="AdminSpaceCard__icon" icon={faUsers} />
            {"123"}
          </div>
        </div>
      </div>
      <div className="AdminSpaceCard__footer">
        <div className="AdminSpaceCard__footer-content">
          <div className="AdminSpaceCard__description">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            Donec qu
          </div>
          <ButtonNG linkTo={adminNGVenueUrl(venue.slug)} disabled={!venue.slug}>
            {/* Manage {SPACE_TAXON.capital} Settings */}
            Edit
          </ButtonNG>
          {/* <ButtonNG linkTo={adminNGSettingsUrl(venue.slug)} disabled={!venue.slug}>
        {SPACE_TAXON.capital} Settings
      </ButtonNG> */}
        </div>
      </div>
    </div>
  );
};
