import React, { useMemo, useState } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { isPartyMapVenue } from "types/venues";

import { sortVenues, VenueSortingOptions } from "utils/venue";

import { useOwnedVenues } from "hooks/useConnectOwnedVenues";

import { AdminVenueCard } from "components/molecules/AdminVenueCard";
import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import "./AdminDashboard.scss";

export const AdminDashboard: React.FC = () => {
  const { ownedVenues: venues, isLoading } = useOwnedVenues({});

  const [
    currentSortingOption,
    setCurrentSortingOption,
  ] = useState<VenueSortingOptions>(VenueSortingOptions.az);

  const sortedVenues = useMemo(
    () => sortVenues(venues, currentSortingOption) ?? [],
    [currentSortingOption, venues]
  );

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

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <AdminRestricted>
      <div className="AdminDashboard">
        <div className="AdminDashboard__header">
          <div className="AdminDashboard__header--left">
            <div className="AdminDashboard__header-title">Admin Dashboard</div>
            {sortingOptions}
          </div>
          <Button as={Link} to="/admin-ng/create/venue">
            Create a new space
          </Button>
        </div>
        <div
          className={classNames("AdminDashboard__cards", {
            "AdminDashboard__cards--empty": !hasVenues,
          })}
        >
          {!hasVenues && (
            <>
              <div className="AdminDashboard__welcome-message">Welcome!</div>
              <div className="AdminDashboard__welcome-message">
                Create your first Sparkle space
              </div>
            </>
          )}
          {hasVenues && renderedPartyVenues}
        </div>
      </div>
    </AdminRestricted>
  );
};
