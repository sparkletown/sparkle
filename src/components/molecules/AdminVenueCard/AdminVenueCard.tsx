import React from "react";
import { Button } from "react-bootstrap";

import { Venue_v2 } from "types/venues";

import { DEFAULT_VENUE_LOGO } from "settings";

import "./AdminVenueCard.scss";

export interface AdminVenueCardProps {
  venue: Venue_v2;
  onClickVenue: (venue: Venue_v2) => void;
}

export const AdminVenueCard: React.FC<AdminVenueCardProps> = ({ venue, onClickVenue }) => (
  <div className="admin-venue-card" >
    <div
      className="admin-venue-card__bg"
      style={{
        backgroundImage: `url(${venue.mapBackgroundImageUrl})`,
      }}
    />
    <div className="admin-venue-card__info">
      <div
        className="admin-venue-card__logo"
        style={{
          backgroundImage: `url(${venue.host?.icon ?? DEFAULT_VENUE_LOGO})`,
        }}
      />
      <h3>{venue.name}</h3>
    </div>
    <Button className="admin-venue-card__button" onClick={() => onClickVenue(venue)}>
      Manage Party
    </Button>
  </div>
);
