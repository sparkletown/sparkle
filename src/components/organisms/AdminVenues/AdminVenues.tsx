import React, { useMemo } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { AnyVenue, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { AdminVenueCard } from "components/molecules/AdminVenueCard";

import "./AdminVenues.scss";

export interface AdminVenuesProps {
  venues: WithId<AnyVenue>[];
}

export const AdminVenues: React.FC<AdminVenuesProps> = ({ venues }) => {
  const partyVenues = useMemo(
    () => venues?.filter((venue) => venue.template === VenueTemplate.partymap),
    [venues]
  );

  const hasVenues = false;

  return (
    <div className="admin-venue">
      <div className="admin-venue__create-button">
        <h3>Admin Dashboard</h3>
        <Button as={Link} to="/admin_v2/venue/creation">
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
          {partyVenues.map((venue) => (
            <AdminVenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
};
