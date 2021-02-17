import React, { useMemo } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { AnyVenue, VenueTemplate } from "types/venues";
import { WithId } from "utils/id";

import "./AdminVenues.scss";

interface AdminVenuesProps {
  venues: WithId<AnyVenue>[];
}

export const AdminVenues: React.FC<AdminVenuesProps> = ({ venues }) => {
  const partyVenues = useMemo(() => {
    return venues?.filter((venue) => venue.template === VenueTemplate.partymap);
  }, [venues]);

  return (
    <div className="admin-venue">
      <div className="admin-venue__create-button">
        <h3>Admin Dashboard</h3>
        <Button as={Link} to="/admin_v2/venue/creation">
          Create a new space
        </Button>
      </div>
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
                <div className="card__text">
                  <h3>{venue.name}</h3>
                </div>
              </div>
              <Link className="card__button" to={`/admin_v2/${venue.id}`}>
                Manage Party
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
