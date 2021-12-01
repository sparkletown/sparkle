import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { ADMIN_V3_WORLD_BASE_URL } from "settings";

import { WorldNavTab } from "types/world";

import { useWorldParams } from "hooks/worlds/useWorldParams";

import { WorldEditorAdvancedPanel } from "pages/WorldEditor/WorldEditorAdvancedPanel";
import { WorldEditorEntrancePanel } from "pages/WorldEditor/WorldEditorEntrancePanel";
import { WorldEditorStartPanel } from "pages/WorldEditor/WorldEditorStartPanel";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { WorldNav } from "components/molecules/WorldNav";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import "./WorldEditor.scss";

const PANEL_MAP = Object.freeze({
  [WorldNavTab.start]: WorldEditorStartPanel,
  [WorldNavTab.entrance]: WorldEditorEntrancePanel,
  [WorldNavTab.advanced]: WorldEditorAdvancedPanel,
});

export const WorldEditor: React.FC = () => {
  const history = useHistory();
  const { worldSlug, selectedTab } = useWorldParams();

  const navigateToHome = useCallback(
    () => history.push(ADMIN_V3_WORLD_BASE_URL),
    [history]
  );

  const WorldEditorPanel = PANEL_MAP[selectedTab] ?? <></>;

  return (
    <div className="WorldEditor">
      <WithNavigationBar>
        <AdminRestricted>
          <WorldNav />
          <WorldEditorPanel
            worldSlug={worldSlug}
            onClickHome={navigateToHome}
          />
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
