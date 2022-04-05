import React from "react";
import { Link } from "react-router-dom";
import { faExternalLinkAlt, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  ATTENDEE_INSIDE_URL,
  PORTAL_INFO_ICON_MAPPING,
  SPACE_TAXON,
} from "settings";

import { WorldSlug } from "types/id";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { adminNGVenueUrl, generateUrl } from "utils/url";

import { AdminCardTitle } from "components/organisms/AdminVenueView/components/AdminCardTitle";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./AdminSpaceCard.scss";

export interface AdminSpaceCardProps {
  venue: WithId<AnyVenue>;
  worldSlug?: WorldSlug;
  isEditable?: boolean;
}

export const AdminSpaceCard: React.FC<AdminSpaceCardProps> = ({
  venue,
  worldSlug,
  isEditable,
}) => {
  const spaceIcon = PORTAL_INFO_ICON_MAPPING[venue.template];

  const spaceDescriptionText =
    venue.config?.landingPageConfig?.description ||
    "Description can be changed in space settings";

  return (
    <div className="AdminSpaceCard">
      <div>
        <div className="AdminSpaceCard__bg-container">
          <Link
            className="AdminSpaceCard__link"
            to={generateUrl({
              route: ATTENDEE_INSIDE_URL,
              required: ["worldSlug", "spaceSlug"],
              params: { worldSlug, spaceSlug: venue.slug },
            })}
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
            <div />
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
            disabled={!venue.slug || !isEditable}
          >
            Edit
          </ButtonNG>
        </div>
      </div>
    </div>
  );
};
