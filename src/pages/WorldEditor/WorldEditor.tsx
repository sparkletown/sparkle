import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { ADMIN_V3_WORLDS_URL } from "settings";

import { WorldNavTab } from "types/WorldNavTab";

import { useWorldEdit } from "hooks/useWorldEdit";
import { useWorldEditParams } from "hooks/useWorldEditParams";

import { WorldEditorAdvancedPanel } from "pages/WorldEditor/WorldEditorAdvancedPanel";
import { WorldEditorEntrancePanel } from "pages/WorldEditor/WorldEditorEntrancePanel";
import { WorldEditorStartPanel } from "pages/WorldEditor/WorldEditorStartPanel";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { WorldNav } from "components/molecules/WorldNav";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import "./WorldEditor.scss";

export const WorldEditor: React.FC = () => {
  const history = useHistory();
  const { worldId, selectedTab } = useWorldEditParams();

  const { isLoaded, world } = useWorldEdit(worldId);

  const navigateToHome = useCallback(() => history.push(ADMIN_V3_WORLDS_URL), [
    history,
  ]);

  return (
    <div className="WorldEditor">
      <WithNavigationBar hasBackButton withSchedule>
        <AdminRestricted>
          <WorldNav />
          {selectedTab === WorldNavTab.start && (
            <WorldEditorStartPanel
              worldId={worldId}
              onClickHome={navigateToHome}
              loaded={isLoaded}
              world={world}
            />
          )}
          {selectedTab === WorldNavTab.entrance && (
            <WorldEditorEntrancePanel
              worldId={worldId}
              onClickHome={navigateToHome}
              loaded={isLoaded}
              world={world}
            />
          )}
          {selectedTab === WorldNavTab.advanced && (
            <WorldEditorAdvancedPanel
              worldId={worldId}
              onClickHome={navigateToHome}
              loaded={isLoaded}
              world={world}
            />
          )}
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
