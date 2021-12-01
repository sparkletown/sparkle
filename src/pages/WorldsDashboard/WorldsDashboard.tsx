import React, { useMemo } from "react";

import { ADMIN_V3_NEW_WORLD_URL } from "settings";

import { useUser } from "hooks/useUser";
import { useOwnWorlds } from "hooks/worlds/useOwnWorlds";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminShowcaseTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseTitle";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSubTitle";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
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
          {hasWorlds ? (
            <>
              <AdminPanel>
                <AdminSidebar>
                  <AdminSidebarTitle>
                    Select or create a world to get started
                  </AdminSidebarTitle>
                  <AdminSidebarSubTitle>
                    This can be an event or a series of events in the sparkly
                    universe
                  </AdminSidebarSubTitle>
                </AdminSidebar>
                <AdminShowcase className="WorldsDashboard__worlds">
                  <div className="WorldsDashboard__new">
                    <ButtonNG
                      variant="normal-gradient"
                      linkTo={ADMIN_V3_NEW_WORLD_URL}
                    >
                      Create new world
                    </ButtonNG>
                  </div>
                  {renderedWorldsList}
                </AdminShowcase>
              </AdminPanel>
            </>
          ) : (
            <AdminShowcase className="WorldsDashboard__worlds">
              <div className="WorldsDashboard__new">
                <ButtonNG
                  variant="normal-gradient"
                  linkTo={ADMIN_V3_NEW_WORLD_URL}
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
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
