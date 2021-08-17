import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { AnyVenue, isPartyMapVenue } from "types/venues";

import { WithId } from "utils/id";

import { AdminVenueCard } from "components/molecules/AdminVenueCard";

import { AdminNavBar } from "../AdminNavBar";

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
    <AdminNavBar disableAll={true}>
      <div className="admin-venue">
        <div className="admin-venue__header">
          <div className="admin-venue__title">Admin Dashboard</div>
          <Link className="admin-venue__button" to="/admin-ng/create/venue">
            Create a new space
          </Link>
        </div>
        <div
          className={classNames("admin-venue__cards", {
            "admin-venue__cards--empty": !hasVenues,
          })}
        >
          {!hasVenues && (
            <>
              <div className="admin-venue__title">Welcome!</div>
              <div className="admin-venue__title">
                Create your first Sparkle space
              </div>
            </>
          )}
          {hasVenues && renderedPartyVenues}
        </div>
      </div>
    </AdminNavBar>
  );
};
