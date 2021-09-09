import React, { useMemo, useState } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { AnyVenue, isPartyMapVenue } from "types/venues";

import { WithId } from "utils/id";
import { sortVenues, VenueSortingOptions } from "utils/venue";

import { AdminVenueCard } from "components/molecules/AdminVenueCard";

import "./AdminVenues.scss";

export interface AdminVenuesProps {
  venues: WithId<AnyVenue>[];
}

export const AdminVenues: React.FC<AdminVenuesProps> = ({ venues }) => {
  const [
    currentSortingOption,
    setCurrentSortingOption,
  ] = useState<VenueSortingOptions>(VenueSortingOptions.az);

  const sortedVenues = useMemo(() => {
    return sortVenues(venues, currentSortingOption) ?? [];
  }, [currentSortingOption, venues]);

  const renderedPartyVenues = useMemo(
    () =>
      sortedVenues
        ?.filter(isPartyMapVenue)
        .map((venue) => <AdminVenueCard key={venue.id} venue={venue} />),
    [sortedVenues]
  );

  const sortingOptions = useMemo(
    () => (
      <DropdownButton variant="secondary" title="Sort venues">
        {Object.values(VenueSortingOptions).map((sortingOption) => (
          <Dropdown.Item
            key={sortingOption}
            onClick={() => setCurrentSortingOption(sortingOption)}
          >
            {sortingOption}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    ),
    []
  );

  const hasVenues = renderedPartyVenues.length > 0;

  return (
    <div className="AdminVenues">
      <div className="AdminVenues__header">
        <div className="AdminVenues__header--left">
          <div className="AdminVenues__header-title">Admin Dashboard</div>
          {sortingOptions}
        </div>
        <Button as={Link} to="/admin-ng/create/venue">
          Create a new space
        </Button>
      </div>
      <div
        className={classNames("AdminVenues__cards", {
          "AdminVenues__cards--empty": !hasVenues,
        })}
      >
        {!hasVenues && (
          <>
            <div className="AdminVenues__title">Welcome!</div>
            <div className="AdminVenues__title">
              Create your first Sparkle space
            </div>
          </>
        )}
        {hasVenues && renderedPartyVenues}
      </div>
    </div>
  );
};
