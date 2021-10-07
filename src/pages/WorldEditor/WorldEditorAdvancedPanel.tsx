import React from "react";

import { World } from "api/admin";

import { WithId } from "utils/id";

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
  loaded: boolean;
  world?: WithId<World>;
}

export const WorldEditorAdvancedPanel: React.FC<WorldEditorAdvancedPanelProps> = ({
  loaded,
  onClickHome,
  world,
  worldId,
}) => (
  <AdminPanel>
    <AdminSidebar>
      <AdminSidebarTitle>Title goes here</AdminSidebarTitle>
      <AdminSidebarFooter onClickHome={onClickHome} />
      {loaded || !worldId ? (
        <WorldAdvancedForm world={world} onClickCancel={onClickHome} />
      ) : (
        <Loading />
      )}
    </AdminSidebar>
    <AdminShowcase>Showcase component goes here</AdminShowcase>
  </AdminPanel>
);