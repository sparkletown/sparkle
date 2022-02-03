import React, { useMemo } from "react";

import { ADMIN_IA_WORLD_CREATE_URL } from "settings";

import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useWorlds } from "hooks/worlds/useWorlds";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminShowcaseTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseTitle";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import { WorldCard } from "components/molecules/WorldCard";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";

import ARROW from "assets/images/admin/dashboard-arrow.svg";

import "./WorldsDashboard.scss";

export const WorldsDashboard: React.FC = () => {
  const { ownedVenues } = useOwnedVenues({});

  const ownedUniqueWorldIds = useMemo(
    () => [...new Set(ownedVenues.map((venue) => venue.worldId))],
    [ownedVenues]
  );

  const worlds = useWorlds();

  // NOTE: We could do this by forming a firebase query where([world.id, 'in', ownedUniqueWorldIds]), but it has a limit of 10 items in ownedUniqueWorldIds.
  // Because of the limit, I decided to do it on frontend
  const uniqueWorlds = useMemo(
    () => worlds.filter((world) => ownedUniqueWorldIds.includes(world.id)),
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
      <WithNavigationBar>
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
      </WithNavigationBar>
    </div>
  );
};
