import React from "react";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { Loading } from "components/molecules/Loading";
import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { WorldEntranceForm } from "components/organisms/WorldEntranceForm";

export interface WorldEditorEntrancePanelProps {
  worldSlug?: string;
}

export const WorldEditorEntrancePanel: React.FC<WorldEditorEntrancePanelProps> = ({
  worldSlug,
}) => {
  const { isLoaded, world } = useWorldBySlug(worldSlug);

  return (
    <AdminPanel variant="bound">
      <AdminSidebar>
        <AdminSidebarTitle>Entrance Experience</AdminSidebarTitle>
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
      <AdminShowcase />
    </AdminPanel>
  );
};
