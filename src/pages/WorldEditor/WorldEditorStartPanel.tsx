import React from "react";

import { useWorldById } from "hooks/worlds/useWorldById";

import { WorldShowcase } from "components/organisms/WorldShowcase/WorldShowcase";
import { WorldStartForm } from "components/organisms/WorldStartForm";

import { AdminPanel } from "components/molecules/AdminPanel";
import { AdminShowcase } from "components/molecules/AdminShowcase";
import { AdminSidebar } from "components/molecules/AdminSidebar";
import { AdminSidebarFooter } from "components/molecules/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/molecules/AdminSidebarTitle";
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
  const { isLoaded, world } = useWorldById(worldId);

  const isUpdatingWorld = isLoaded && worldId && world;
  const isCreatingWorld = isLoaded && !world && !worldId;

  return (
    <AdminPanel>
      <AdminSidebar>
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
