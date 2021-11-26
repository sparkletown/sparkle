import React, { useMemo, useState } from "react";
import {
  Dropdown as ReactBootstrapDropdown,
  DropdownButton,
} from "react-bootstrap";
import classNames from "classnames";

import { ADMIN_V3_WORLDS_BASE_URL } from "settings";

import { isNotPartyMapVenue, isPartyMapVenue } from "types/venues";

import { adminCreateWorldSpace, adminWorldUrl } from "utils/url";
import { sortVenues, VenueSortingOptions } from "utils/venue";

import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminSpaceCard } from "components/molecules/AdminSpaceCard";
import { AdminTitle } from "components/molecules/AdminTitle";
import { AdminTitleBar } from "components/molecules/AdminTitleBar";
import { AdminToolbar } from "components/molecules/AdminToolbar";
import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";

import "./SpacesDashboard.scss";

export const SpacesDashboard: React.FC = () => {
  const { ownedVenues, isLoading: isLoadingSpaces } = useOwnedVenues({});

  const { worldSlug } = useWorldParams();

  const { world, isLoaded: isWorldLoaded } = useWorldBySlug(worldSlug);

  const venues = useMemo(
    () =>
      world ? ownedVenues.filter((venue) => venue.worldId === world.id) : [],
    [ownedVenues, world]
  );

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

  const renderedOtherVenues = useMemo(
    () =>
      sortedVenues
        ?.filter(isNotPartyMapVenue)
        .map((venue) => <AdminSpaceCard key={venue.id} venue={venue} />),
    [sortedVenues]
  );

  const hasPartyVenues = renderedPartyVenues.length > 0;
  const hasOtherVenues = renderedOtherVenues.length > 0;

  if (isLoadingSpaces || !isWorldLoaded) {
    return <LoadingPage />;
  }

  return (
    <div className="SpacesDashboard">
      <WithNavigationBar hasBackButton withSchedule>
        <AdminRestricted>
          <AdminToolbar>
            <ButtonNG
              variant="secondary"
              isLink
              linkTo={ADMIN_V3_WORLDS_BASE_URL}
            >
              Change world
            </ButtonNG>

            <div className="SpacesDashboard__header-content">
              {sortingOptions}
            </div>
            <ButtonNG
              variant="primary"
              isLink
              linkTo={adminCreateWorldSpace(world?.slug)}
            >
              Create a new space
            </ButtonNG>
          </AdminToolbar>
          <AdminTitleBar>
            <AdminTitle>{world?.name} dashboard</AdminTitle>
            <ButtonNG
              variant="secondary"
              isLink
              linkTo={adminWorldUrl(worldSlug)}
            >
              Settings
            </ButtonNG>
          </AdminTitleBar>

          {hasPartyVenues && <AdminTitle>My map spaces</AdminTitle>}
          <div
            className={classNames("SpacesDashboard__cards", {
              "SpacesDashboard__cards--empty": !hasPartyVenues,
            })}
          >
            {!hasPartyVenues && (
              <>
                <div className="SpacesDashboard__welcome-message">Welcome!</div>
                <div className="SpacesDashboard__welcome-message">
                  Create your first Sparkle space
                </div>
              </>
            )}
            {hasPartyVenues && renderedPartyVenues}
          </div>

          {hasOtherVenues && <AdminTitle>My other spaces</AdminTitle>}
          <div
            className={classNames("SpacesDashboard__cards", {
              "SpacesDashboard__cards--empty": !hasOtherVenues,
            })}
          >
            {hasOtherVenues && renderedOtherVenues}
          </div>
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
