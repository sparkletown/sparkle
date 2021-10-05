import React from "react";

import { World } from "api/admin";

import { WithId } from "utils/id";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { WorldEntranceForm } from "components/organisms/WorldEntranceForm";

import { Loading } from "components/molecules/Loading";

export interface WorldEditorEntrancePanelProps {
  worldId?: string;
  onClickHome: () => void;
  loaded: boolean;
  world?: WithId<World>;
}

export const WorldEditorEntrancePanel: React.FC<WorldEditorEntrancePanelProps> = ({
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
        <WorldEntranceForm world={world} onClickCancel={onClickHome} />
      ) : (
        <Loading />
      )}
    </AdminSidebar>
    <AdminShowcase>Showcase component goes here</AdminShowcase>
  </AdminPanel>
);
