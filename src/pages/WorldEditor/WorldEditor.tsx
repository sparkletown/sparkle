import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { ADMIN_V3_WORLDS_URL } from "settings";

import { useWorldEdit } from "hooks/useWorldEdit";
import { useWorldId } from "hooks/useWorldId";

import { WorldEditorAdvancedPanel } from "pages/WorldEditor/WorldEditorAdvancedPanel";
import { WorldEditorEntrancePanel } from "pages/WorldEditor/WorldEditorEntrancePanel";
import { WorldEditorStartPanel } from "pages/WorldEditor/WorldEditorStartPanel";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { WorldNav } from "components/molecules/WorldNav";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import "./WorldEditor.scss";

export const WorldEditor: React.FC = () => {
  const worldId = useWorldId();
  const history = useHistory();

  const { isLoaded, world } = useWorldEdit(worldId);

  const navigateToHome = useCallback(() => history.push(ADMIN_V3_WORLDS_URL), [
    history,
  ]);

  // TODO: Remove the following noinspection comment after navigation is added
  // noinspection PointlessBooleanExpressionJS
  return (
    <div className="WorldEditor">
      <WithNavigationBar hasBackButton withSchedule>
        <AdminRestricted>
          <WorldNav />
          {
            // TODO: replace with check for selected tab
            true && (
              <WorldEditorStartPanel
                worldId={worldId}
                onClickHome={navigateToHome}
                loaded={isLoaded}
                world={world}
              />
            )
          }
          {
            // TODO: replace with check for selected tab
            false && (
              <WorldEditorEntrancePanel
                worldId={worldId}
                onClickHome={navigateToHome}
                loaded={isLoaded}
                world={world}
              />
            )
          }
          {
            // TODO: replace with check for selected tab
            false && (
              <WorldEditorAdvancedPanel
                worldId={worldId}
                onClickHome={navigateToHome}
                loaded={isLoaded}
                world={world}
              />
            )
          }
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
