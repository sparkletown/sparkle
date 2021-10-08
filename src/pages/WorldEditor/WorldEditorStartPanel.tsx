import React from "react";

import { adminCreateWorldSpace } from "utils/url";

import { useWorldEdit } from "hooks/useWorldEdit";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { WorldStartForm } from "components/organisms/WorldStartForm";

import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./WorldEditorStartPanel.scss";

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
        {worldId && (
          <div className="WorldEditor__new">
            <ButtonNG
              variant="normal-gradient"
              linkTo={adminCreateWorldSpace(worldId)}
            >
              Create a new space
            </ButtonNG>
          </div>
        )}
      </AdminShowcase>
    </AdminPanel>
  );
};
