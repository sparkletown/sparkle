import React from "react";
import { SidebarHeader } from "components/admin/SidebarHeader";
import { ThreeColumnLayout } from "components/admin/ThreeColumnLayout";
import { WorldGeneralForm } from "components/admin/WorldGeneralForm";
import { WorldShowcase } from "components/admin/WorldShowcase";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

import { Loading } from "components/molecules/Loading";

import "./WorldEditorGeneralPanel.scss";

export interface WorldEditorGeneralPanelProps {
  worldSlug?: string;
}

export const WorldEditorGeneralPanel: React.FC<WorldEditorGeneralPanelProps> = ({
  worldSlug,
}) => {
  const { isLoaded, world } = useWorldBySlug(worldSlug);

  const isUpdatingWorld = isLoaded && worldSlug && world;
  const isCreatingWorld = isLoaded && !world && !worldSlug;

  return (
    <AdminPanel variant="bound">
      <ThreeColumnLayout>
        <AdminSidebar>
          <SidebarHeader>Configure your world</SidebarHeader>
          {isUpdatingWorld || isCreatingWorld ? (
            <WorldGeneralForm world={world} />
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
