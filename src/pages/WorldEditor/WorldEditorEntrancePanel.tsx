import React from "react";

import { useWorldById } from "hooks/worlds/useWorldById";

import { WorldEntranceForm } from "components/organisms/WorldEntranceForm";

import { AdminPanel } from "components/molecules/AdminPanel";
import { AdminShowcase } from "components/molecules/AdminShowcase";
import { AdminSidebar } from "components/molecules/AdminSidebar";
import { AdminSidebarFooter } from "components/molecules/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/molecules/AdminSidebarTitle";
import { Loading } from "components/molecules/Loading";

export interface WorldEditorEntrancePanelProps {
  worldId?: string;
  onClickHome: () => void;
}

export const WorldEditorEntrancePanel: React.FC<WorldEditorEntrancePanelProps> = ({
  onClickHome,
  worldId,
}) => {
  const { isLoaded, world } = useWorldById(worldId);
  return (
    <AdminPanel>
      <AdminSidebar>
        <AdminSidebarTitle>Entrance Experience</AdminSidebarTitle>
        <AdminSidebarFooter onClickHome={onClickHome} />
        {isLoaded ? (
          world ? (
            <WorldEntranceForm world={world} onClickCancel={onClickHome} />
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
