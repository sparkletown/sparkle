import React from "react";
import { SidebarHeader } from "components/admin/SidebarHeader";
import { ThreeColumnLayout } from "components/admin/ThreeColumnLayout";
import { WorldEntranceForm } from "components/admin/WorldEntranceForm";
import { WorldShowcase } from "components/admin/WorldShowcase";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

import { Loading } from "components/molecules/Loading";

export interface WorldEditorEntrancePanelProps {
  worldSlug?: string;
}

export const WorldEditorEntrancePanel: React.FC<WorldEditorEntrancePanelProps> = ({
  worldSlug,
}) => {
  const { isLoaded, world } = useWorldBySlug(worldSlug);

  return (
    <AdminPanel variant="bound">
      <ThreeColumnLayout>
        <AdminSidebar>
          <SidebarHeader>Entrance Experience</SidebarHeader>
          {isLoaded ? (
            world ? (
              <WorldEntranceForm world={world} />
            ) : (
              // TODO: Display not found component
              "World Not Found"
            )
          ) : (
            <Loading />
          )}
        </AdminSidebar>
        <AdminShowcase>
          <WorldShowcase world={world} />
        </AdminShowcase>
      </ThreeColumnLayout>
    </AdminPanel>
  );
};
