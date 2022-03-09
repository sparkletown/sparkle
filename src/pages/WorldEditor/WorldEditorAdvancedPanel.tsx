import React from "react";
import { SidebarHeader } from "components/admin/SidebarHeader";
import { ThreeColumnLayout } from "components/admin/ThreeColumnLayout";
import { WorldAdvancedForm } from "components/admin/WorldAdvancedForm";
import { WorldShowcase } from "components/admin/WorldShowcase";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

import { Loading } from "components/molecules/Loading";

export interface WorldEditorAdvancedPanelProps {
  worldSlug?: string;
}

export const WorldEditorAdvancedPanel: React.FC<WorldEditorAdvancedPanelProps> = ({
  worldSlug,
}) => {
  const { isLoaded, world } = useWorldBySlug(worldSlug);
  return (
    <AdminPanel variant="bound">
      <ThreeColumnLayout>
        <AdminSidebar>
          <SidebarHeader>Advanced Settings</SidebarHeader>
          {isLoaded ? (
            world ? (
              <WorldAdvancedForm world={world} />
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
