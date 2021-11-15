import React from "react";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { SpaceEditorStartPanel } from "pages/Admin/Details";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { NotFound } from "components/atoms/NotFound";

import "./SpaceCreateWizard.scss";

export const SpaceCreateWizard: React.FC = () => {
  const { worldSlug } = useWorldParams();
  const { world, isLoaded } = useWorldBySlug(worldSlug);

  if (!isLoaded) {
    return <LoadingPage />;
  }

  if (!world) {
    return <NotFound />;
  }

  return (
    <WithNavigationBar>
      <AdminRestricted>
        <div className="SpaceWizard">
          <div className="SpaceWizard__pad"> </div>
          <SpaceEditorStartPanel worldId={world.id} />
        </div>
      </AdminRestricted>
    </WithNavigationBar>
  );
};
