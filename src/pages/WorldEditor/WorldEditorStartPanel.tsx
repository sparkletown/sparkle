import React from "react";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { WorldShowcase } from "components/organisms/WorldShowcase/WorldShowcase";
import { WorldStartForm } from "components/organisms/WorldStartForm";

import { Loading } from "components/molecules/Loading";

import "./WorldEditorStartPanel.scss";

export interface WorldEditorStartPanelProps {
  worldSlug?: string;
  onClickHome: () => void;
}

export const WorldEditorStartPanel: React.FC<WorldEditorStartPanelProps> = ({
  worldSlug,
  onClickHome,
}) => {
  const { isLoaded, world } = useWorldBySlug(worldSlug);

  const isUpdatingWorld = isLoaded && worldSlug && world;
  const isCreatingWorld = isLoaded && !world && !worldSlug;

  return (
    <AdminPanel>
      <AdminSidebar>
        <AdminSidebarTitle>
          {worldSlug ? "Configure your world" : "Create a new world"}
        </AdminSidebarTitle>
        <AdminSidebarFooter onClickHome={onClickHome} />
        {isUpdatingWorld || isCreatingWorld ? (
          <WorldStartForm world={world} onClickCancel={onClickHome} />
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
