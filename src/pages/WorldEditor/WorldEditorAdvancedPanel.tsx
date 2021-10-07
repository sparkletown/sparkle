import React from "react";

import { useWorldEdit } from "hooks/useWorldEdit";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { WorldAdvancedForm } from "components/organisms/WorldAdvancedForm";

import { Loading } from "components/molecules/Loading";

export interface WorldEditorAdvancedPanelProps {
  worldId?: string;
  onClickHome: () => void;
}

export const WorldEditorAdvancedPanel: React.FC<WorldEditorAdvancedPanelProps> = ({
  onClickHome,
  worldId,
}) => {
  const { isLoaded, world } = useWorldEdit(worldId);
  return (
    <AdminPanel>
      <AdminSidebar>
        <AdminSidebarTitle>Advanced Settings: {world?.name}</AdminSidebarTitle>
        <AdminSidebarFooter onClickHome={onClickHome} />
        {isLoaded || !worldId ? (
          <WorldAdvancedForm world={world} onClickCancel={onClickHome} />
        ) : (
          <Loading />
        )}
      </AdminSidebar>
      <AdminShowcase>Showcase component goes here</AdminShowcase>
    </AdminPanel>
  );
};
