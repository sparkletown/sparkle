import React from "react";

import { ADMIN_V3_NEW_WORLD_URL } from "settings";

import { useWorldEdit } from "hooks/useWorldEdit";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { WorldStartForm } from "components/organisms/WorldStartForm";

import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";

export interface WorldEditorStartPanelProps {
  worldId?: string;
  onClickHome: () => void;
}

export const WorldEditorStartPanel: React.FC<WorldEditorStartPanelProps> = ({
  onClickHome,
  worldId,
}) => {
  const { isLoaded, world } = useWorldEdit(worldId);
  return (
    <AdminPanel>
      <AdminSidebar>
        <AdminSidebarTitle>
          {worldId ? "Configure your world" : "Create a new world"}
        </AdminSidebarTitle>
        <AdminSidebarFooter onClickHome={onClickHome} />
        {isLoaded || !worldId ? (
          <WorldStartForm world={world} onClickCancel={onClickHome} />
        ) : (
          <Loading />
        )}
      </AdminSidebar>
      <AdminShowcase>
        <div className="WorldEditor__new">
          <ButtonNG gradient="gradient" linkTo={ADMIN_V3_NEW_WORLD_URL}>
            Create a new space
          </ButtonNG>
        </div>
      </AdminShowcase>
    </AdminPanel>
  );
};
