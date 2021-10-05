import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { ADMIN_V3_NEW_WORLD_URL, ADMIN_V3_WORLDS_URL } from "settings";

import { useWorldEdit } from "hooks/useWorldEdit";
import { useWorldId } from "hooks/useWorldId";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { WorldForm } from "components/organisms/WorldForm";

import { Loading } from "components/molecules/Loading";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";

import "./WorldEditor.scss";

export const WorldEditor: React.FC = () => {
  const worldId = useWorldId();
  const history = useHistory();

  const { isLoaded, world } = useWorldEdit(worldId);

  const navigateToHome = useCallback(() => history.push(ADMIN_V3_WORLDS_URL), [
    history,
  ]);

  const title = worldId ? "Configure your world" : "Create a new world";

  return (
    <div className="WorldEditor">
      <WithNavigationBar hasBackButton withSchedule>
        <AdminRestricted>
          <AdminPanel>
            <AdminSidebar>
              <AdminSidebarTitle>{title}</AdminSidebarTitle>
              <AdminSidebarFooter onClickHome={navigateToHome} />
              {isLoaded || !worldId ? (
                <WorldForm world={world} onClickCancel={navigateToHome} />
              ) : (
                <Loading />
              )}
            </AdminSidebar>
            <AdminShowcase>
              <div className="WorldEditor__new">
                <ButtonNG gradient="gradient" linkTo={ADMIN_V3_NEW_WORLD_URL}>
                  Create a new world
                </ButtonNG>
              </div>
            </AdminShowcase>
          </AdminPanel>
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
