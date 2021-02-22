import React from "react";
import { Link } from "react-router-dom";

import { AnyVenue } from "types/venues";

import { DEFAULT_VENUE_LOGO } from "settings";

import { WithId } from "utils/id";

import "./AdminVenueCard.scss";

export interface AdminVenueCardProps {
  venue: WithId<AnyVenue>;
}

export const AdminVenueCard: React.FC<AdminVenueCardProps> = ({ venue }) => {
  return (
    <div className="admin-venue-card">
      <div
        className="admin-venue-card__bg"
        style={{
          backgroundImage: `url(${venue.mapBackgroundImageUrl})`,
        }}
      ></div>
      <div className="admin-venue-card__info">
        <div
          className="admin-venue-card__logo"
          style={{
            backgroundImage: `url(${venue.host?.icon ?? DEFAULT_VENUE_LOGO})`,
          }}
        ></div>
        <h3>{venue.name}</h3>
      </div>
      <Link className="admin-venue-card__button" to={`/admin_v2/${venue.id}`}>
        Manage Party
      </Link>
    </div>
  );
};
