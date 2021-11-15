import React, { useMemo } from "react";

import { ADMIN_V3_NEW_WORLD_URL } from "settings";

import { useUser } from "hooks/useUser";
import { useOwnWorlds } from "hooks/worlds/useOwnWorlds";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminPanel } from "components/molecules/AdminPanel";
import { AdminShowcase } from "components/molecules/AdminShowcase";
import { AdminShowcaseSubTitle } from "components/molecules/AdminShowcaseSubTitle";
import { AdminShowcaseTitle } from "components/molecules/AdminShowcaseTitle";
import { AdminSidebar } from "components/molecules/AdminSidebar";
import { AdminSidebarSubTitle } from "components/molecules/AdminSidebarSubTitle";
import { AdminSidebarTitle } from "components/molecules/AdminSidebarTitle";
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
        <AdminShowcaseTitle>Let’s create a world</AdminShowcaseTitle>
        <AdminShowcaseSubTitle>It’s fast and easy</AdminShowcaseSubTitle>
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
      <WithNavigationBar hasBackButton withSchedule>
        <AdminRestricted>
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
                  Create a new world
                </ButtonNG>
                {!hasWorlds && (
                  <img
                    alt="arrow pointing towards the Create a world button"
                    className="WorldsDashboard__arrow"
                    src={ARROW}
                  />
                )}
              </div>
              {hasWorlds ? renderedWorldsList : renderedWelcomePage}
            </AdminShowcase>
          </AdminPanel>
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
