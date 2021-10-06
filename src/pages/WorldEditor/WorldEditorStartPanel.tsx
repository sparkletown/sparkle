import React from "react";

import { World } from "api/admin";

import { WithId } from "utils/id";

import { AdminDashboard } from "components/organisms/AdminDashboard";
import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { WorldStartForm } from "components/organisms/WorldStartForm";

import { Loading } from "components/molecules/Loading";

import "./WorldEditorStartPanel.scss";

export interface WorldEditorStartPanelProps {
  worldId?: string;
  onClickHome: () => void;
  loaded: boolean;
  world?: WithId<World>;
}

export const WorldEditorStartPanel: React.FC<WorldEditorStartPanelProps> = ({
  loaded,
  onClickHome,
  world,
  worldId,
}) => (
  <AdminPanel>
    <AdminSidebar>
      <AdminSidebarTitle>
        {worldId ? "Configure your world" : "Create a new world"}
      </AdminSidebarTitle>
      <AdminSidebarFooter onClickHome={onClickHome} />
      {loaded || !worldId ? (
        <WorldStartForm world={world} onClickCancel={onClickHome} />
      ) : (
        <Loading />
      )}
    </AdminSidebar>
    <AdminShowcase>
      {worldId && <AdminDashboard worldName={world?.name} worldId={worldId} />}
    </AdminShowcase>
  </AdminPanel>
);
