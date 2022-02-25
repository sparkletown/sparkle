import React from "react";
import { Header } from "components/admin/Header";
import { AdminLayout } from "components/layouts/AdminLayout";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { WorldNavTab } from "types/world";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { WorldEditorAdvancedPanel } from "pages/WorldEditor/WorldEditorAdvancedPanel";
import { WorldEditorEntrancePanel } from "pages/WorldEditor/WorldEditorEntrancePanel";
import { WorldEditorGeneralPanel } from "pages/WorldEditor/WorldEditorGeneralPanel";

import { LoadingPage } from "components/molecules/LoadingPage";
import { WorldNav } from "components/molecules/WorldNav";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import "./WorldEditor.scss";

const PANEL_MAP = Object.freeze({
  [WorldNavTab.general]: WorldEditorGeneralPanel,
  [WorldNavTab.entrance]: WorldEditorEntrancePanel,
  [WorldNavTab.advanced]: WorldEditorAdvancedPanel,
});

const createModeCrumbtrail = [{ name: "Switch World", href: "switch-world" }];

export const WorldEditor: React.FC = () => {
  const { worldSlug, selectedTab } = useWorldParams();
  const { world, isLoaded } = useWorldBySlug(worldSlug);

  if (!isLoaded) {
    return <LoadingPage />;
  }

  const editMode = !!world?.id;
  const adminTitle = editMode ? "Settings" : "Create world";

  const WorldEditorPanel = PANEL_MAP[selectedTab] ?? <></>;

  const crumbtrail = editMode ? ALWAYS_EMPTY_ARRAY : createModeCrumbtrail;

  return (
    <AdminLayout>
      <div className="WorldEditor">
        <AdminRestricted>
          <Header crumbtrail={crumbtrail} title={adminTitle} />
          {editMode && <WorldNav />}
          <WorldEditorPanel worldSlug={worldSlug} />
        </AdminRestricted>
      </div>
    </AdminLayout>
  );
};
