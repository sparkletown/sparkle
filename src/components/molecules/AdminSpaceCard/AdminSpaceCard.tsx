import React from "react";
import { Link } from "react-router-dom";
import { useCss } from "react-use";
import { faExternalLinkAlt, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import {
  DEFAULT_VENUE_BANNER_COLOR,
  DEFAULT_VENUE_LOGO,
  PORTAL_INFO_ICON_MAPPING,
  SPACE_TAXON,
} from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { adminNGVenueUrl, venueInsideUrl } from "utils/url";

import { useValidImage } from "hooks/useCheckImage";

import { AdminCardTitle } from "components/organisms/AdminVenueView/components/AdminCardTitle";

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
  const [validBannerImageUrl] = useValidImage(
    venue?.config?.landingPageConfig.coverImageUrl ||
      venue?.config?.landingPageConfig.bannerImageUrl,
    DEFAULT_VENUE_BANNER_COLOR
  );

  const backgroundStyle = useCss({
    // @debt There should be a way to move the rgba() functions to SCSS and use $color-constant instead of literals
    background: `linear-gradient(
        rgba(25, 24, 26, 0.8),
        rgba(25, 24, 26, 0.8)
      ), url(${validBannerImageUrl})`,
  });
  const backgroundClasses = classNames("AdminSpaceCard__bg", backgroundStyle);
  const logoStyle = useCss({
    "background-image": `url(${venue.host?.icon || DEFAULT_VENUE_LOGO})`,
  });
  const logoClasses = classNames("AdminSpaceCard__logo", logoStyle);

  const spaceIcon = PORTAL_INFO_ICON_MAPPING[venue.template];

  const spaceDescriptionText =
    venue.config?.landingPageConfig?.description ||
    "Description can be changed in space settings";

  return (
    <div className="AdminSpaceCard">
      <div className={backgroundClasses}>
        <div className="AdminSpaceCard__bg-container">
          <Link
            className="AdminSpaceCard__link"
            to={venueInsideUrl(venue.slug)}
            target="_blank"
            rel="noopener noreferer"
          >
            Visit
            <FontAwesomeIcon
              className="AdminSpaceCard__link-icon"
              icon={faExternalLinkAlt}
            />
          </Link>
          <div className="AdminSpaceCard__body">
            <div className={logoClasses} />
            <div className="AdminSpaceCard__body-info">
              <AdminCardTitle>{venue.name}</AdminCardTitle>
              <span className="AdminSpaceCard__text">
                <img
                  alt={`the ${SPACE_TAXON.lower} icon`}
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
          {!!venue.recentUserCount && (
            <div className="AdminSpaceCard__user-count">
              <FontAwesomeIcon
                className="AdminSpaceCard__icon"
                icon={faUsers}
              />
              {venue.recentUserCount}
            </div>
          )}
        </div>
      </div>
      <div className="AdminSpaceCard__footer">
        <div className="AdminSpaceCard__footer-content">
          <div className="AdminSpaceCard__description">
            <span className="AdminSpaceCard__description-text">
              {spaceDescriptionText}
            </span>
          </div>
          <ButtonNG
            linkTo={
              worldSlug && venue.slug
                ? adminNGVenueUrl(worldSlug, venue.slug)
                : "#"
            }
            disabled={!venue.slug}
          >
            Edit
          </ButtonNG>
        </div>
      </div>
    </div>
  );
};
