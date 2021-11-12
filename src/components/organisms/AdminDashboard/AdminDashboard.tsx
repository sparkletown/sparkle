import React, { useMemo, useState } from "react";
import {
  Dropdown as ReactBootstrapDropdown,
  DropdownButton,
} from "react-bootstrap";
import classNames from "classnames";

import { ADMIN_V3_WORLDS_BASE_URL } from "settings";

import { isPartyMapVenue } from "types/venues";

import { adminCreateWorldSpace } from "utils/url";
import { sortVenues, VenueSortingOptions } from "utils/venue";

import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { AdminShowcaseTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseTitle";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminSpaceCard } from "components/molecules/AdminSpaceCard";
import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";

import "./AdminDashboard.scss";

export const AdminDashboard: React.FC = () => {
  const { ownedVenues, isLoading: isLoadingSpaces } = useOwnedVenues({});

  const { worldSlug } = useWorldParams();

  const { world, isLoaded: isWorldLoaded } = useWorldBySlug(worldSlug);

  const venues = world
    ? ownedVenues.filter((venue) => venue.worldId === world.id)
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

  if (isLoadingSpaces || !isWorldLoaded) {
    return <LoadingPage />;
  }

  return (
    <div className="AdminDashboard">
      <WithNavigationBar hasBackButton withSchedule>
        <AdminRestricted>
          <div className="AdminDashboard__header">
            <ButtonNG
              variant="secondary"
              isLink
              linkTo={ADMIN_V3_WORLDS_BASE_URL}
            >
              Back to worlds
            </ButtonNG>

            <div className="AdminDashboard__header-content">
              <AdminShowcaseTitle>Spaces</AdminShowcaseTitle>
              {sortingOptions}
            </div>
            <ButtonNG
              variant="primary"
              isLink
              linkTo={adminCreateWorldSpace(world?.slug)}
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
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
