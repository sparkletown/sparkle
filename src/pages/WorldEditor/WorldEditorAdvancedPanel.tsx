import React from "react";

import { useWorldById } from "hooks/worlds/useWorldById";

import { WorldAdvancedForm } from "components/organisms/WorldAdvancedForm";

import { AdminPanel } from "components/molecules/AdminPanel";
import { AdminShowcase } from "components/molecules/AdminShowcase";
import { AdminSidebar } from "components/molecules/AdminSidebar";
import { AdminSidebarFooter } from "components/molecules/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/molecules/AdminSidebarTitle";
import { Loading } from "components/molecules/Loading";

export interface WorldEditorAdvancedPanelProps {
  worldId?: string;
  onClickHome: () => void;
}

export const WorldEditorAdvancedPanel: React.FC<WorldEditorAdvancedPanelProps> = ({
  onClickHome,
  worldId,
}) => {
  const { isLoaded, world } = useWorldById(worldId);
  return (
    <AdminPanel>
      <AdminSidebar>
        <AdminSidebarTitle>Advanced Settings: {world?.name}</AdminSidebarTitle>
        <AdminSidebarFooter onClickHome={onClickHome} />
        {isLoaded ? (
          world ? (
            <WorldAdvancedForm world={world} onClickCancel={onClickHome} />
          ) : (
            // TODO: Display not found component
            "World Not Found"
          )
        ) : (
          <Loading />
        )}
      </AdminSidebar>
      <AdminShowcase></AdminShowcase>
    </AdminPanel>
  );
};
