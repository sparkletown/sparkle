import React, { useMemo, useState } from "react";
import {
  Dropdown as ReactBootstrapDropdown,
  DropdownButton,
} from "react-bootstrap";
import classNames from "classnames";

import { isPartyMapVenue } from "types/venues";

import { adminCreateWorldSpace } from "utils/url";
import { sortVenues, VenueSortingOptions } from "utils/venue";

import { useOwnedVenues } from "hooks/useConnectOwnedVenues";

import { AdminShowcaseTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseTitle";

import { AdminSpaceCard } from "components/molecules/AdminSpaceCard";
import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";

import "./AdminDashboard.scss";

export interface AdminDashboardProps {
  worldId?: string;
  worldName?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  worldId,
  worldName,
}) => {
  const { ownedVenues, isLoading } = useOwnedVenues({});

  const venues = worldId
    ? ownedVenues.filter((venue) => venue.worldId === worldId)
    : ownedVenues;

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
        .map((venue) => <AdminSpaceCard key={venue.id} venue={venue} />),
    [sortedVenues]
  );

  const sortingOptions = useMemo(
    () => (
      // @debt align the style of the SpacesDropdown with the Dropdown component
      <DropdownButton variant="secondary" title="Sort spaces">
        {Object.values(VenueSortingOptions).map((sortingOption) => (
          <ReactBootstrapDropdown.Item
            key={sortingOption}
            onClick={() => setCurrentSortingOption(sortingOption)}
          >
            {sortingOption}
          </ReactBootstrapDropdown.Item>
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
          <div className="AdminDashboard__header-content">
            <AdminShowcaseTitle>{worldName} Spaces</AdminShowcaseTitle>
            {sortingOptions}
          </div>
          <ButtonNG
            variant="primary"
            isLink
            linkTo={adminCreateWorldSpace(worldId)}
          >
            Create a new space
          </ButtonNG>
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
