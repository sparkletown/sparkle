import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { ADMIN_V3_WORLD_BASE_URL } from "settings";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { SpaceCreateForm } from "components/organisms/SpaceCreateForm";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import { Loading } from "components/molecules/Loading";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import "./SpaceCreatePage.scss";

export const SpaceCreatePage: React.FC = () => {
  const history = useHistory();
  const { worldSlug } = useSpaceParams();
  const { isLoaded: isWorldLoaded, worldId } = useWorldBySlug(worldSlug);

  const navigateToHome = useCallback(
    () => history.push(ADMIN_V3_WORLD_BASE_URL),
    [history]
  );

  return (
    <div className="SpaceCreatePage">
      <WithNavigationBar hasBackButton withSchedule>
        <AdminRestricted>
          <AdminPanel variant="unbound">
            <AdminSidebar>
              <AdminSidebarTitle>Create a new space</AdminSidebarTitle>
              {isWorldLoaded ? (
                <SpaceCreateForm worldId={worldId} onDone={navigateToHome} />
              ) : (
                <Loading />
              )}
            </AdminSidebar>
            <AdminShowcase>
              <div>empty for now, images to show later</div>
            </AdminShowcase>
          </AdminPanel>
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
