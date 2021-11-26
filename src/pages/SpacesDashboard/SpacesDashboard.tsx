import React, { useMemo, useState } from "react";
import classNames from "classnames";

import { ADMIN_V3_WORLDS_BASE_URL } from "settings";

import { isNotPartyMapVenue, isPartyMapVenue } from "types/venues";

import { adminCreateWorldSpace, adminWorldUrl } from "utils/url";
import { SortingOptions, sortVenues } from "utils/venue";

import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminSpaceCard } from "components/molecules/AdminSpaceCard";
import { AdminTitle } from "components/molecules/AdminTitle";
import { AdminTitleBar } from "components/molecules/AdminTitleBar";
import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";
import { SortDropDown } from "components/atoms/SortDropDown";

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
  ] = useState<SortingOptions>(SortingOptions.az);

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

  // const sortingOptions = useMemo(
  //   () => (
  //     // @debt align the style of the SpacesDropdown with the Dropdown component
  //     <DropdownButton variant="secondary" title="Sort spaces">
  //       {Object.values(VenueSortingOptions).map((sortingOption) => (
  //         <ReactBootstrapDropdown.Item
  //           key={sortingOption}
  //           onClick={() => setCurrentSortingOption(sortingOption)}
  //         >
  //           {sortingOption}
  //         </ReactBootstrapDropdown.Item>
  //       ))}
  //     </DropdownButton>
  //   ),
  //   []
  // );

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
          <AdminTitleBar>
            <ButtonNG
              variant="secondary"
              isLink
              linkTo={ADMIN_V3_WORLDS_BASE_URL}
            >
              Change world
            </ButtonNG>
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
          <main
            className={classNames("SpacesDashboard__main", {
              "SpacesDashboard__main--empty": !hasPartyVenues,
            })}
          >
            <div className="SpacesDashboard__cards">
              {!hasPartyVenues && (
                <>
                  <div className="SpacesDashboard__welcome-message">
                    Welcome!
                  </div>
                  <div className="SpacesDashboard__welcome-message">
                    <p>Welcome!</p>
                    <p>Create your first Sparkle space</p>
                  </div>
                </>
              )}
              {hasPartyVenues && renderedPartyVenues}
            </div>

            <aside className="SpacesDashboard__aside">
              <SortDropDown
                onClick={setCurrentSortingOption}
                title="Sort spaces"
              />
              <ButtonNG
                variant="primary"
                isLink
                linkTo={adminCreateWorldSpace(world?.slug)}
              >
                Create a new space
              </ButtonNG>
            </aside>
          </main>

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