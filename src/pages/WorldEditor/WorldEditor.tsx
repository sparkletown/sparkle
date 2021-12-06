import React from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { ADMIN_ROOT_URL } from "settings";

import { WorldNavTab } from "types/world";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { WorldEditorAdvancedPanel } from "pages/WorldEditor/WorldEditorAdvancedPanel";
import { WorldEditorEntrancePanel } from "pages/WorldEditor/WorldEditorEntrancePanel";
import { WorldEditorGeneralPanel } from "pages/WorldEditor/WorldEditorGeneralPanel";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminTitle } from "components/molecules/AdminTitle";
import { AdminTitleBar } from "components/molecules/AdminTitleBar";
import { LoadingPage } from "components/molecules/LoadingPage";
import { WorldNav } from "components/molecules/WorldNav";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";

import "./WorldEditor.scss";

const PANEL_MAP = Object.freeze({
  [WorldNavTab.general]: WorldEditorGeneralPanel,
  [WorldNavTab.entrance]: WorldEditorEntrancePanel,
  [WorldNavTab.advanced]: WorldEditorAdvancedPanel,
});

export const WorldEditor: React.FC = () => {
  const { worldSlug, selectedTab } = useWorldParams();
  const { world, isLoaded } = useWorldBySlug(worldSlug);

  if (!isLoaded) {
    return <LoadingPage />;
  }

  const adminTitle = world ? `${world.name} settings` : "Create a new world";

  const WorldEditorPanel = PANEL_MAP[selectedTab] ?? <></>;

  return (
    <div className="WorldEditor">
      <WithNavigationBar>
        <AdminRestricted>
          <AdminTitleBar variant="two-rows">
            {world && (
              <ButtonNG linkTo={ADMIN_ROOT_URL} iconName={faArrowLeft}>
                Back to Dashboard
              </ButtonNG>
            )}
            <AdminTitle>{adminTitle}</AdminTitle>
          </AdminTitleBar>
          <WorldNav />
          <WorldEditorPanel worldSlug={worldSlug} />
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
