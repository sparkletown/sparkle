import React from "react";

import { useUser } from "hooks/useUser";
import { useOwnWorlds } from "hooks/worlds/useOwnWorlds";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import "./AdminWorldsView.scss";

export const AdminWorldsView: React.FC = () => {
  const user = useUser();

  const worlds = useOwnWorlds(user.userId);

  return (
    <WithNavigationBar withSchedule>
      <AdminRestricted>
        <AdminPanel className="AdminWorldsView">
          <AdminSidebar>
            <AdminSidebarTitle></AdminSidebarTitle>
          </AdminSidebar>
          <AdminShowcase className="AdminWorldsView__worlds-list">
            {worlds.map((world) => {
              return (
                <div className="AdminWorldsView__world-panel" key={world.id}>
                  {world.name}
                </div>
              );
            })}
          </AdminShowcase>
        </AdminPanel>
      </AdminRestricted>
    </WithNavigationBar>
  );
};
