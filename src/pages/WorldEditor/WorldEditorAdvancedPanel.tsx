import React from "react";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { Loading } from "components/molecules/Loading";
import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { WorldAdvancedForm } from "components/organisms/WorldAdvancedForm";

export interface WorldEditorAdvancedPanelProps {
  worldSlug?: string;
}

export const WorldEditorAdvancedPanel: React.FC<WorldEditorAdvancedPanelProps> = ({
  worldSlug,
}) => {
  const { isLoaded, world } = useWorldBySlug(worldSlug);
  return (
    <AdminPanel variant="bound">
      <AdminSidebar>
        <AdminSidebarTitle>Advanced Settings: {world?.name}</AdminSidebarTitle>
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
      <AdminShowcase />
    </AdminPanel>
  );
};
