import React, { useMemo } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { VenueTemplate, Venue_v2 } from "types/venues";

import { WithId } from "utils/id";

import "./AdminVenues.scss";

interface AdminVenuesProps {
  venues: WithId<Venue_v2>[];
}

export const AdminVenues: React.FC<AdminVenuesProps> = ({ venues }) => {
  const partyVenues = useMemo(() => {
    return venues?.filter((venue) => venue.template === VenueTemplate.partymap);
  }, [venues]);

  const hasVenues: boolean = !!partyVenues.length;

  return (
    <div className="admin-venue">
      <div className="admin-venue__create-button">
        <h3>Admin Dashboard</h3>
        <Button as={Link} to="/admin_v2/venue">
          Create a new space
        </Button>
      </div>
      {!hasVenues && (
        <div className="admin-venue__empty-venues">
          <h3>Welcome!</h3>
          <h3>Create your first Sparkle space</h3>
        </div>
      )}
      {hasVenues && (
        <div className="admin-venue__cards">
          {partyVenues.map((venue, index) => {
            return (
              <div key={index} className="card">
                <div
                  className="card__bg"
                  style={{
                    backgroundImage: `url(${venue.mapBackgroundImageUrl})`,
                    backgroundSize: "cover",
                  }}
                ></div>
                <div className="card__info">
                  <div
                    className="card__logo"
                    style={{ backgroundImage: `url(${venue.host?.icon})` }}
                  ></div>
                  <h3>{venue.name}</h3>
                </div>
                <Button
                  className="card__button"
                  as={Link}
                  to={`/admin_v2/venue/${venue.id}`}
                >
                  Manage Space
                </Button>
                <Button
                  className="card__button"
                  as={Link}
                  to={`/admin_v2/advanced-settings/${venue.id}`}
                >
                  Advanced Settings
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
