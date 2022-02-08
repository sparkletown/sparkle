import React, { useMemo, useState } from "react";
import classNames from "classnames";

import {
  ADMIN_IA_SPACE_CREATE_PARAM_URL,
  ADMIN_IA_WORLD_BASE_URL,
  ADMIN_IA_WORLD_EDIT_PARAM_URL,
  ADMIN_IA_WORLD_SCHEDULE_URL,
  ADMIN_IA_WORLD_TOOLS_PARAM_URL,
  SPACE_TAXON,
  SPACES_TAXON,
} from "settings";

import { Spaces, UserId, WorldId, WorldSlug, WorldWithId } from "types/id";
import { isNotPartyMapVenue, isPartyMapVenue } from "types/venues";

import { generateUrl } from "utils/url";
import { SortingOptions, sortVenues } from "utils/venue";

import { WithNavigationBar } from "components/organisms/WithNavigationBar";

import { AdminSpaceCard } from "components/molecules/AdminSpaceCard";
import { AdminTitle } from "components/molecules/AdminTitle";
import { AdminTitleBar } from "components/molecules/AdminTitleBar";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";
import { SortDropDown } from "components/atoms/SortDropDown";
import { TesterRestricted } from "components/atoms/TesterRestricted";

import "./SpacesDashboard.scss";

interface SpacesDashboardProps {
  ownSpaces: Spaces;
  userId: UserId;
  world: WorldWithId;
  worldId: WorldId;
  worldSlug: WorldSlug;
}

export const SpacesDashboard: React.FC<SpacesDashboardProps> = ({
  ownSpaces,
  userId,
  world,
  worldId,
  worldSlug,
}) => {
  const isWorldAdmin = userId ? world?.owners.includes(userId) : undefined;

  const spaces = useMemo(
    () => (world ? ownSpaces.filter((venue) => venue.worldId === worldId) : []),
    [ownSpaces, world, worldId]
  );

  const [
    currentSortingOption,
    setCurrentSortingOption,
  ] = useState<SortingOptions>(SortingOptions.az);

  const sortedVenues = useMemo(
    () => sortVenues(spaces, currentSortingOption) ?? [],
    [currentSortingOption, spaces]
  );

  const renderedPartyVenues = useMemo(
    () =>
      sortedVenues?.filter(isPartyMapVenue).map((venue) => {
        const isSpaceAdmin = userId
          ? venue.owners?.includes(userId)
          : undefined;

        return (
          <AdminSpaceCard
            key={venue.id}
            venue={venue}
            worldSlug={worldSlug}
            isEditable={isWorldAdmin || isSpaceAdmin}
          />
        );
      }),
    [sortedVenues, worldSlug, isWorldAdmin, userId]
  );

  const renderedOtherVenues = useMemo(
    () =>
      sortedVenues?.filter(isNotPartyMapVenue).map((venue) => {
        const isSpaceAdmin = userId
          ? venue.owners?.includes(userId)
          : undefined;

        return (
          <AdminSpaceCard
            key={venue.id}
            venue={venue}
            worldSlug={worldSlug}
            isEditable={isWorldAdmin || isSpaceAdmin}
          />
        );
      }),
    [sortedVenues, worldSlug, isWorldAdmin, userId]
  );

  const hasPartyVenues = renderedPartyVenues.length > 0;
  const hasOtherVenues = renderedOtherVenues.length > 0;

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
              {isWorldAdmin && (
                <ButtonNG
                  variant="secondary"
                  isLink
                  linkTo={generateUrl({
                    route: ADMIN_IA_WORLD_EDIT_PARAM_URL,
                    required: ["worldSlug"],
                    params: { worldSlug },
                  })}
                >
                  Settings
                </ButtonNG>
              )}
            </div>
            <ButtonNG
              variant="secondary"
              isLink
              linkTo={generateUrl({
                route: ADMIN_IA_WORLD_SCHEDULE_URL,
                required: ["worldSlug"],
                params: { worldSlug },
              })}
            >
              World schedule
            </ButtonNG>
          </AdminTitleBar>

          <TesterRestricted>
            <div className="SpacesDashboard__tools">
              <ButtonNG
                variant="secondary"
                isLink
                linkTo={generateUrl({
                  route: ADMIN_IA_WORLD_TOOLS_PARAM_URL,
                  required: ["worldSlug"],
                  params: { worldSlug },
                })}
              >
                Tools
              </ButtonNG>
            </div>
          </TesterRestricted>

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
