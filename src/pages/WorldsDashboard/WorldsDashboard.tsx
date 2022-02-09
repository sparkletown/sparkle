import React, { useMemo } from "react";
import { uniq } from "lodash/fp";

import { ADMIN_IA_WORLD_CREATE_URL } from "settings";

import { UserId } from "types/id";

import { useOwnedVenues } from "hooks/useOwnedVenues";
import { useOwnWorlds } from "hooks/worlds/useOwnWorlds";
import { useWorlds } from "hooks/worlds/useWorlds";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminShowcaseTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseTitle";
import { WithAdminNavBar } from "components/organisms/WithAdminNavBar";

import { WorldCard } from "components/molecules/WorldCard";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";

import ARROW from "assets/images/admin/dashboard-arrow.svg";

import "./WorldsDashboard.scss";

type WorldsDashboardProps = { userId: UserId };

export const WorldsDashboard: React.FC<WorldsDashboardProps> = ({ userId }) => {
  const { ownedVenues } = useOwnedVenues({ userId });
  const worlds = useWorlds();
  const ownWorlds = useOwnWorlds();

  const ownedUniqueWorldIds = useMemo(
    () =>
      uniq([
        ...ownedVenues.map(({ worldId }) => worldId),
        ...ownWorlds.map((world) => world.id),
      ]),
    [ownedVenues, ownWorlds]
  );

  // Firebase query where([world.id, 'in', ownedUniqueWorldIds]) has a limit of 10 items in ownedUniqueWorldIds. Because of that, it is filtered here
  const uniqueWorlds = useMemo(
    () => worlds.filter(({ id }) => ownedUniqueWorldIds.includes(id)),
    [worlds, ownedUniqueWorldIds]
  );

  const hasWorlds = !!worlds.length;

  const renderedWelcomePage = useMemo(
    () => (
      <div className="WorldsDashboard__messages-container">
        <AdminShowcaseTitle>
          Start by creating
          <div>your first world</div>
        </AdminShowcaseTitle>
      </div>
    ),
    []
  );

  const renderedWorldsList = useMemo(
    () => (
      <div className="WorldsDashboard__worlds-list">
        {uniqueWorlds.map((world) => (
          <WorldCard key={world.id} world={world} />
        ))}
      </div>
    ),
    [uniqueWorlds]
  );

  return (
    <div className="WorldsDashboard">
      <WithAdminNavBar>
        <AdminRestricted>
          <AdminPanel variant="unbound">
            {hasWorlds ? (
              <AdminShowcase>
                {/* @debt: possibly add <AdminTitleBar to wrap header content */}
                <AdminShowcaseTitle>Switch World</AdminShowcaseTitle>
                <div className="WorldsDashboard__header">
                  <span className="WorldsDashboard__header-text">
                    My worlds
                  </span>
                  <ButtonNG
                    variant="normal-gradient"
                    linkTo={ADMIN_IA_WORLD_CREATE_URL}
                    className="WorldsDashboard__header-button"
                  >
                    Create new world
                  </ButtonNG>
                </div>
                {renderedWorldsList}
              </AdminShowcase>
            ) : (
              <AdminShowcase>
                <div className="WorldsDashboard__arrow-header">
                  <ButtonNG
                    variant="normal-gradient"
                    linkTo={ADMIN_IA_WORLD_CREATE_URL}
                  >
                    Create new world
                  </ButtonNG>
                  <img
                    alt="arrow pointing towards the Create a world button"
                    className="WorldsDashboard__arrow"
                    src={ARROW}
                  />
                </div>
                {renderedWelcomePage}
              </AdminShowcase>
            )}
          </AdminPanel>
        </AdminRestricted>
      </WithAdminNavBar>
    </div>
  );
};
