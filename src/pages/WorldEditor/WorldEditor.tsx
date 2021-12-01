import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { WorldNavTab } from "types/world";

import { adminWorldSpacesUrl } from "utils/url";

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
  const history = useHistory();
  const { worldSlug, selectedTab } = useWorldParams();
  const { world, isLoaded } = useWorldBySlug(worldSlug);

  const goBack = useCallback(() => {
    if (history.length) {
      history.goBack();
    } else {
      history.push(adminWorldSpacesUrl(world?.slug));
    }
  }, [history, world?.slug]);

  if (!isLoaded) {
    return <LoadingPage />;
  }

  const adminTitle =
    world !== undefined ? `${world.name} settings` : "Create a new world";

  const WorldEditorPanel = PANEL_MAP[selectedTab] ?? <></>;

  return (
    <div className="WorldEditor">
      <WithNavigationBar>
        <AdminRestricted>
          <AdminTitleBar>
            {world !== undefined && (
              <ButtonNG
                linkTo={adminWorldSpacesUrl(world.slug)}
                iconName={faArrowLeft}
              >
                Back to Dashboard
              </ButtonNG>
            )}
            <AdminTitle>{adminTitle}</AdminTitle>
          </AdminTitleBar>
          <WorldNav />
          <WorldEditorPanel worldSlug={worldSlug} onClickHome={goBack} />
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
