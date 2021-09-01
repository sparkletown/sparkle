import React, { useMemo } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { AnyVenue, isPartyMapVenue } from "types/venues";

import { WithId } from "utils/id";

import { AdminVenueCard } from "components/molecules/AdminVenueCard";

import { M } from "components/atoms/M";

import "./AdminVenues.scss";

export interface AdminVenuesProps {
  venues: WithId<AnyVenue>[];
}

export const AdminVenues: React.FC<AdminVenuesProps> = ({ venues }) => {
  const renderedPartyVenues = useMemo(
    () =>
      venues
        ?.filter(isPartyMapVenue)
        .map((venue) => <AdminVenueCard key={venue.id} venue={venue} />),
    [venues]
  );

  const hasVenues = renderedPartyVenues.length > 0;

  return (
    <div className="admin-venue">
      <div className="admin-venue__header">
        <div className="admin-venue__title">
          <M>{AdminVenues.name}.title</M>
        </div>
        <M>
          <Button as={Link} to="/admin-ng/create/venue">
            <M>{AdminVenues.name}.create.button</M>
          </Button>
        </M>
      </div>
      <div
        className={classNames("admin-venue__cards", {
          "admin-venue__cards--empty": !hasVenues,
        })}
      >
        {!hasVenues && (
          <>
            <div className="admin-venue__title">
              <M>{AdminVenues.name}.welcome.message</M>
            </div>
            <div className="admin-venue__title">
              <M>{AdminVenues.name}.no.venues.message</M>
            </div>
          </>
        )}
        {hasVenues && renderedPartyVenues}
      </div>
    </div>
  );
};
