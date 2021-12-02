import React from "react";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { WorldAdvancedForm } from "components/organisms/WorldAdvancedForm";

import { Loading } from "components/molecules/Loading";

export interface WorldEditorAdvancedPanelProps {
  worldSlug?: string;
  onClickHome: () => void;
}

export const WorldEditorAdvancedPanel: React.FC<WorldEditorAdvancedPanelProps> = ({
  worldSlug,
  onClickHome,
}) => {
  const { isLoaded, world } = useWorldBySlug(worldSlug);
  return (
    <AdminPanel variant="bound">
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
