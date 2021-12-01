import React from "react";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { WorldGeneralForm } from "components/organisms/WorldGeneralForm";
import { WorldShowcase } from "components/organisms/WorldShowcase/WorldShowcase";

import { Loading } from "components/molecules/Loading";

import "./WorldEditorGeneralPanel.scss";

export interface WorldEditorGeneralPanelProps {
  worldSlug?: string;
  onClickHome: () => void;
}

export const WorldEditorGeneralPanel: React.FC<WorldEditorGeneralPanelProps> = ({
  worldSlug,
  onClickHome,
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
        <AdminSidebarFooter onClickHome={onClickHome} />
        {isUpdatingWorld || isCreatingWorld ? (
          <WorldGeneralForm world={world} onClickCancel={onClickHome} />
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
