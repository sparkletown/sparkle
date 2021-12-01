import React from "react";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";

import { SpaceEditorStartPanel } from "pages/Admin/Details";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { NotFound } from "components/atoms/NotFound";

import "./SpaceEditWizard.scss";

export const SpaceEditWizard: React.FC = () => {
  const { spaceSlug } = useSpaceParams();
  const { space, isLoaded: isSpaceLoaded } = useSpaceBySlug(spaceSlug);

  if (!isSpaceLoaded) {
    return <LoadingPage />;
  }

  if (!space) {
    return <NotFound />;
  }

  return (
    <WithNavigationBar>
      <AdminRestricted>
        <div className="SpaceWizard">
          <div className="SpaceWizard__pad"> </div>
          <SpaceEditorStartPanel venue={space} />
        </div>
      </AdminRestricted>
    </WithNavigationBar>
  );
};
