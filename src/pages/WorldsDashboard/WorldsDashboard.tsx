import React, { useMemo } from "react";

import { ADMIN_V3_WORLD_CREATE_URL } from "settings";

import { useUser } from "hooks/useUser";
import { useOwnWorlds } from "hooks/worlds/useOwnWorlds";

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
  const user = useUser();

  const worlds = useOwnWorlds(user.userId);

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
        {worlds.map((world) => (
          <WorldCard key={world.id} world={world} />
        ))}
      </div>
    ),
    [worlds]
  );

  return (
    <div className="WorldsDashboard">
      <WithNavigationBar title="Sparkle Admin">
        <AdminRestricted>
          <AdminPanel variant="unbound">
            {hasWorlds ? (
              <AdminShowcase className="WorldsDashboard__worlds">
                <AdminShowcaseTitle>Switch World</AdminShowcaseTitle>
                <div className="WorldsDashboard__header">
                  <span className="WorldsDashboard__header-text">
                    My worlds
                  </span>
                  <ButtonNG
                    variant="normal-gradient"
                    linkTo={ADMIN_V3_WORLD_CREATE_URL}
                    className="WorldsDashboard__header-button"
                  >
                    Create new world
                  </ButtonNG>
                </div>
                {renderedWorldsList}
              </AdminShowcase>
            ) : (
              <AdminShowcase className="WorldsDashboard__worlds">
                <div className="WorldsDashboard__arrow-header">
                  <ButtonNG
                    variant="normal-gradient"
                    linkTo={ADMIN_V3_WORLD_CREATE_URL}
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
