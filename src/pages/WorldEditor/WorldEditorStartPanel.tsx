import React from "react";

import { useWorldEdit } from "hooks/useWorldEdit";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { WorldShowcase } from "components/organisms/WorldShowcase/WorldShowcase";
import { WorldStartForm } from "components/organisms/WorldStartForm";

import { Loading } from "components/molecules/Loading";

import "./WorldEditorStartPanel.scss";

export interface WorldEditorStartPanelProps {
  worldId?: string;
  onClickHome: () => void;
}

export const WorldEditorStartPanel: React.FC<WorldEditorStartPanelProps> = ({
  onClickHome,
  worldId,
}) => {
  const { isLoaded, world } = useWorldEdit(worldId);

  const isUpdatingWorld = isLoaded && worldId && world;
  const isCreatingWorld = isLoaded && !world && !worldId;

  const sidebarClassName = !worldId ? "AdminDashboard__sidebar" : "";

  return (
    <AdminPanel>
      <AdminSidebar className={sidebarClassName}>
        <AdminSidebarTitle>
          {worldId ? "Configure your world" : "Create a new world"}
        </AdminSidebarTitle>
        <AdminSidebarFooter onClickHome={onClickHome} />
        {isUpdatingWorld || isCreatingWorld ? (
          <WorldStartForm world={world} onClickCancel={onClickHome} />
        ) : (
          <Loading />
        )}
      </AdminSidebar>
      <AdminShowcase>
        <WorldShowcase world={world} />
      </AdminShowcase>
    </AdminPanel>
  );
};
