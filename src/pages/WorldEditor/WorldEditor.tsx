import React from "react";
import { AdminRestrictedLoading } from "components/admin/AdminRestrictedLoading";
import { AdminRestrictedMessage } from "components/admin/AdminRestrictedMessage";
import { Header } from "components/admin/Header";
import { WorldNav } from "components/admin/WorldNav";
import { AdminLayout } from "components/layouts/AdminLayout";
import { WithPermission } from "components/shared/WithPermission";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { WorldNavTab } from "types/world";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { WorldEditorAdvancedPanel } from "pages/WorldEditor/WorldEditorAdvancedPanel";
import { WorldEditorEntrancePanel } from "pages/WorldEditor/WorldEditorEntrancePanel";
import { WorldEditorGeneralPanel } from "pages/WorldEditor/WorldEditorGeneralPanel";

import { LoadingPage } from "components/molecules/LoadingPage";

import "./WorldEditor.scss";

const PANEL_MAP = Object.freeze({
  [WorldNavTab.general]: WorldEditorGeneralPanel,
  [WorldNavTab.entrance]: WorldEditorEntrancePanel,
  [WorldNavTab.advanced]: WorldEditorAdvancedPanel,
});

const createModeCrumbtrail = [{ name: "Switch World", href: "switch-world" }];

export const WorldEditor: React.FC = () => {
  const { worldSlug, selectedTab } = useWorldParams();
  const { world, isLoaded } = useWorldBySlug({ worldSlug });

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
        {/* @debt the check here should probably depend on editMode */}
        <WithPermission
          check="super"
          loading={<AdminRestrictedLoading />}
          fallback={<AdminRestrictedMessage />}
        >
          <Header crumbtrail={crumbtrail} title={adminTitle} />
          {editMode && <WorldNav />}
          <WorldEditorPanel worldSlug={worldSlug} />
        </WithPermission>
      </div>
    </AdminLayout>
  );
};
