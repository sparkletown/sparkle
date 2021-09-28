import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { ADMIN_V3_NEW_WORLD_URL, ADMIN_V3_ROOT_URL } from "settings";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminShowcaseSubTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseSubTitle";
import { AdminShowcaseTitle } from "components/organisms/AdminVenueView/components/AdminShowcaseTitle";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { TabFooter } from "components/organisms/AdminVenueView/components/TabFooter";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";

import { AdminSidebarSubTitle } from "../AdminVenueView/components/AdminSidebarSubTitle";

import ARROW from "assets/images/admin/dashboard-arrow.svg";

import "./WorldsDashboard.scss";

export const WorldsDashboard: React.FC = () => {
  const history = useHistory();
  const navigateToHome = useCallback(() => history.push(ADMIN_V3_ROOT_URL), [
    history,
  ]);

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
              <TabFooter onClickHome={navigateToHome} />
            </AdminSidebar>
            <AdminShowcase>
              <div className="WorldsDashboard__new">
                <ButtonNG gradient="gradient" linkTo={ADMIN_V3_NEW_WORLD_URL}>
                  Create a new world
                </ButtonNG>
                <img
                  alt="arrow pointing towards the Create a world button"
                  className="WorldsDashboard__arrow"
                  src={ARROW}
                />
              </div>
              <div className="WorldsDashboard__messages-container">
                <AdminShowcaseTitle>Let’s create a world</AdminShowcaseTitle>
                <AdminShowcaseSubTitle>
                  It’s fast and easy
                </AdminShowcaseSubTitle>
              </div>
            </AdminShowcase>
          </AdminPanel>
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
