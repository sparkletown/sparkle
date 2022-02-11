import React, { useMemo } from "react";
import { uniq } from "lodash/fp";

import { ADMIN_IA_WORLD_CREATE_URL } from "settings";

import { UserId } from "types/id";

import { useOwnedVenues } from "hooks/useOwnedVenues";
import { useAdminRole } from "hooks/user/useAdminRole";
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
  const { ownWorlds } = useOwnWorlds({ userId });

  const { isAdminUser: isSuperAdmin } = useAdminRole({ userId });

  const visibleWorldIds = useMemo(
    () =>
      uniq([
        ...ownedVenues.map(({ worldId }) => worldId),
        ...ownWorlds.map((world) => world.id),
      ]),
    [ownedVenues, ownWorlds]
  );

  // NOTE: Firebase query where([world.id, 'in', visibleWorldIds]) has a limit of 10 items in visibleWorldIds. Because of that, it is filtered here
  const visibleWorlds = useMemo(
    () => worlds.filter(({ id }) => visibleWorldIds.includes(id)),
    [worlds, visibleWorldIds]
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
        {visibleWorlds.map((world) => (
          <WorldCard key={world.id} world={world} />
        ))}
      </div>
    ),
    [visibleWorlds]
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
                  {isSuperAdmin && (
                    <ButtonNG
                      variant="normal-gradient"
                      linkTo={ADMIN_IA_WORLD_CREATE_URL}
                      className="WorldsDashboard__header-button"
                    >
                      Create new world
                    </ButtonNG>
                  )}
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
