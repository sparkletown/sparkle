import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { withRequired } from "components/hocs/withRequired";
import { withWorldAndSpaceFromUrl } from "components/hocs/withWorldAndSpaceFromUrl";
import { withLogin } from "core/AnalyticsCheck/withLogin";
import { compose } from "redux";

import {
  ADMIN_IA_SPACE_CREATE_PARAM_URL,
  ADMIN_IA_WORLD_BASE_URL,
  ADMIN_IA_WORLD_EDIT_PARAM_URL,
  SPACE_TAXON,
  SPACES_TAXON,
} from "settings";

import { World } from "api/world";

import { UserId } from "types/id";
import { isNotPartyMapVenue, isPartyMapVenue } from "types/venues";

import { WithId } from "utils/id";
import { generateUrl } from "utils/url";
import { SortingOptions, sortVenues } from "utils/venue";

import { useOwnedVenues } from "hooks/useOwnedVenues";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminSpaceCard } from "components/molecules/AdminSpaceCard";
import { AdminTitle } from "components/molecules/AdminTitle";
import { AdminTitleBar } from "components/molecules/AdminTitleBar";
import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";
import { SortDropDown } from "components/atoms/SortDropDown";

import "./SpacesDashboard.scss";

interface InnerSpacesDashboardProps {
  userId: UserId;
  world: WithId<World>;
}

const InnerSpacesDashboard: React.FC<InnerSpacesDashboardProps> = ({
  world,
  userId,
}) => {
  const { ownedVenues, isLoading: isLoadingSpaces } = useOwnedVenues({
    worldId: world.id,
    userId,
  });

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
        .map((venue) => (
          <AdminSpaceCard key={venue.id} venue={venue} worldSlug={world.slug} />
        )),
    [sortedVenues, world.slug]
  );

  const renderedOtherVenues = useMemo(
    () =>
      sortedVenues
        ?.filter(isNotPartyMapVenue)
        .map((venue) => (
          <AdminSpaceCard key={venue.id} venue={venue} worldSlug={world.slug} />
        )),
    [sortedVenues, world.slug]
  );

  const hasPartyVenues = renderedPartyVenues.length > 0;
  const hasOtherVenues = renderedOtherVenues.length > 0;

  if (isLoadingSpaces) {
    return <LoadingPage />;
  }

  return (
    <div className="SpacesDashboard">
      <WithNavigationBar
        variant="internal-scroll"
        title={`${world?.name ?? ""}`}
      >
        <AdminRestricted>
          <AdminTitleBar variant="grid-with-tools">
            <ButtonNG
              variant="secondary"
              isLink
              linkTo={ADMIN_IA_WORLD_BASE_URL}
            >
              Change world
            </ButtonNG>
            <AdminTitle>{world?.name} dashboard</AdminTitle>
            <div>
              <ButtonNG
                variant="secondary"
                isLink
                linkTo={generateUrl({
                  route: ADMIN_IA_WORLD_EDIT_PARAM_URL,
                  required: ["worldSlug"],
                  params: { worldSlug: world.slug },
                })}
              >
                Settings
              </ButtonNG>
            </div>
          </AdminTitleBar>

          {hasPartyVenues && <AdminTitle>My map spaces</AdminTitle>}
          <main
            className={classNames("SpacesDashboard__main", {
              "SpacesDashboard__main--empty": !hasPartyVenues,
            })}
          >
            <div className="SpacesDashboard__cards">
              {!hasPartyVenues && (
                <div className="SpacesDashboard__welcome-message">
                  <p>Welcome!</p>
                  <p>Create your first Sparkle {SPACE_TAXON.lower}</p>
                </div>
              )}
              {hasPartyVenues && renderedPartyVenues}
            </div>

            <aside className="SpacesDashboard__aside">
              <SortDropDown
                onClick={setCurrentSortingOption}
                title={`Sort ${SPACES_TAXON.lower}`}
              />
              <ButtonNG
                variant="primary"
                isLink
                linkTo={generateUrl({
                  route: ADMIN_IA_SPACE_CREATE_PARAM_URL,
                  required: ["worldSlug"],
                  params: { worldSlug: world?.slug },
                })}
                disabled={!world?.slug}
              >
                Create a new {SPACE_TAXON.lower}
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

type SpacesDashboardProps = Omit<InnerSpacesDashboardProps, "userId" | "world">;

// eslint-disable-next-line
// @ts-ignore
export const SpacesDashboard: React.FC<SpacesDashboardProps> = compose(
  withLogin(),
  withWorldAndSpaceFromUrl,
  withRequired({ required: ["userId", "world"], fallback: LoadingPage })
  // eslint-disable-next-line
  // @ts-ignore
)(InnerSpacesDashboard);
