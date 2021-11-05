import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { ADMIN_V3_WORLDS_BASE_URL } from "settings";

import { WorldNavTab } from "types/world";

import { useWorldEditParams } from "hooks/useWorldEditParams";

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
  const { worldSlug, selectedTab } = useWorldEditParams();

  const navigateToHome = useCallback(
    () => history.push(ADMIN_V3_WORLDS_BASE_URL),
    [history]
  );

  const WorldEditorPanel = PANEL_MAP[selectedTab] ?? <></>;

  return (
    <div className="WorldEditor">
      <WithNavigationBar hasBackButton withSchedule>
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
