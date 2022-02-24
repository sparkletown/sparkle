import React from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { ADMIN_IA_WORLD_BASE_URL } from "settings";

import { WorldNavTab } from "types/world";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { WorldEditorAdvancedPanel } from "pages/WorldEditor/WorldEditorAdvancedPanel";
import { WorldEditorEntrancePanel } from "pages/WorldEditor/WorldEditorEntrancePanel";
import { WorldEditorGeneralPanel } from "pages/WorldEditor/WorldEditorGeneralPanel";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";
import { AdminLayout } from "components/layouts/AdminLayout";
import { AdminTitle } from "components/molecules/AdminTitle";
import { AdminTitleBar } from "components/molecules/AdminTitleBar";
import { LoadingPage } from "components/molecules/LoadingPage";
import { WorldNav } from "components/molecules/WorldNav";
import { WithNavigationBar } from "components/organisms/WithNavigationBar";

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

  const editMode = !!world?.id;
  const worldName = world?.name ?? "";
  const adminTitle = editMode
    ? worldName
      ? `${worldName} settings`
      : "Settings"
    : "Create a new world";

  const WorldEditorPanel = PANEL_MAP[selectedTab] ?? <></>;

  return (
    <AdminLayout>
      <div className="WorldEditor">
        <WithNavigationBar title={worldName}>
          <AdminRestricted>
            <AdminTitleBar variant="two-rows">
              <ButtonNG linkTo={ADMIN_IA_WORLD_BASE_URL} iconName={faArrowLeft}>
                Back to Dashboard
              </ButtonNG>
              <AdminTitle>{adminTitle}</AdminTitle>
            </AdminTitleBar>
            {editMode && <WorldNav />}
            <WorldEditorPanel worldSlug={worldSlug} />
          </AdminRestricted>
        </WithNavigationBar>
      </div>
    </AdminLayout>
  );
};
