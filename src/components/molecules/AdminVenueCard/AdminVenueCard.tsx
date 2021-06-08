import React from "react";
import { Link } from "react-router-dom";

import { AnyVenue } from "types/venues";

import { DEFAULT_VENUE_LOGO } from "settings";

import { WithId } from "utils/id";
import { adminV3SettigsUrl, adminv3VenueUrl } from "utils/url";

import "./AdminVenueCard.scss";

export interface AdminVenueCardProps {
  venue: WithId<AnyVenue>;
}

export const AdminVenueCard: React.FC<AdminVenueCardProps> = ({ venue }) => (
  <div className="AdminVenueCard">
    <div
      className="AdminVenueCard__bg"
      style={{
        backgroundImage: `url(${venue.mapBackgroundImageUrl})`,
      }}
    />
    <div className="AdminVenueCard__info">
      <div
        className="AdminVenueCard__logo"
        style={{
          backgroundImage: `url(${venue.host?.icon ?? DEFAULT_VENUE_LOGO})`,
        }}
      />
      <h3>{venue.name}</h3>
    </div>
    <Link className="AdminVenueCard__button" to={adminv3VenueUrl(venue.id)}>
      Manage Space
    </Link>
    <Link className="AdminVenueCard__button" to={adminV3SettigsUrl(venue.id)}>
      Advanced Settings
    </Link>
  </div>
);
