import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";

import { ADMIN_V3_NEW_WORLD_URL, ADMIN_V3_ROOT_URL } from "settings";

import { useUser } from "hooks/useUser";
import { useOwnWorlds } from "hooks/worlds/useOwnWorlds";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminShowcaseSubTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseSubTitle";
import { AdminShowcaseTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseTitle";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSubTitle";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import { WorldCard } from "components/molecules/WorldCard";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";

import ARROW from "assets/images/admin/dashboard-arrow.svg";

import "./WorldsDashboard.scss";

export const WorldsDashboard: React.FC = () => {
  const history = useHistory();
  const navigateToHome = useCallback(() => history.push(ADMIN_V3_ROOT_URL), [
    history,
  ]);

  const user = useUser();

  const worlds = useOwnWorlds(user.userId);

  const hasWorlds = !!worlds.length;

  const renderWelcomePage = useMemo(
    () => (
      <div className="WorldsDashboard__messages-container">
        <AdminShowcaseTitle>Let’s create a world</AdminShowcaseTitle>
        <AdminShowcaseSubTitle>It’s fast and easy</AdminShowcaseSubTitle>
      </div>
    ),
    []
  );

  const renderWorldsList = useMemo(
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
              <AdminSidebarFooter onClickHome={navigateToHome} />
            </AdminSidebar>
            <AdminShowcase className="WorldsDashboard__worlds">
              <div className="WorldsDashboard__new">
                <ButtonNG gradient="gradient" linkTo={ADMIN_V3_NEW_WORLD_URL}>
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
              {hasWorlds ? renderWorldsList : renderWelcomePage}
            </AdminShowcase>
          </AdminPanel>
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
