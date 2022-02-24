import React from "react";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { Loading } from "components/molecules/Loading";
import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { WorldGeneralForm } from "components/organisms/WorldGeneralForm";
import { WorldShowcase } from "components/organisms/WorldShowcase";

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
      <AdminSidebar>
        <AdminSidebarTitle>
          {worldSlug ? "Manage general settings" : "Create a new world"}
        </AdminSidebarTitle>
        {isUpdatingWorld || isCreatingWorld ? (
          <WorldGeneralForm world={world} />
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
