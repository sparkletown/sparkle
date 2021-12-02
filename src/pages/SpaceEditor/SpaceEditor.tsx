import React, { useMemo } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { SpaceSlug } from "types/venues";
import { WorldSlug } from "types/world";

import { adminNGSettingsUrl } from "utils/url";

import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

import VenueWizard from "pages/Admin/Venue/VenueWizard/VenueWizard";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import "./SpaceEditor.scss";

export enum SpaceEditorTab {
  basicInfo = "basic-info",
}

export interface SpaceEditorRouteParams {
  worldSlug?: WorldSlug;
  spaceSlug?: SpaceSlug;
  selectedTab?: SpaceEditorTab;
}

const spaceEditorTabLabelMap: Readonly<Record<SpaceEditorTab, String>> = {
  [SpaceEditorTab.basicInfo]: "Start",
};

export const SpaceEditor: React.FC = () => {
  const {
    worldSlug,
    spaceSlug,
    selectedTab = SpaceEditorTab.basicInfo,
  } = useParams<SpaceEditorRouteParams>();

  const { space, isLoaded: isSpaceLoaded } = useWorldAndSpaceBySlug(
    worldSlug,
    spaceSlug
  );

  const renderedSpaceEditorTabs = useMemo(() => {
    return Object.entries(spaceEditorTabLabelMap).map(([key, label]) => (
      <Link
        key={key}
        className={classNames({
          AdminVenueView__tab: true,
          "AdminVenueView__tab--selected": selectedTab === key,
        })}
        to={adminNGSettingsUrl(spaceSlug, key)}
      >
        {label}
      </Link>
    ));
  }, [selectedTab, spaceSlug]);

  if (!isSpaceLoaded) {
    return <LoadingPage />;
  }

  if (!space) {
    //@debt Add NotFound page here after it's merged
    return null;
  }

  return (
    <WithNavigationBar>
      <AdminRestricted>
        <div className="SpaceEditor">
          <div className="SpaceEditor__options">{renderedSpaceEditorTabs}</div>
        </div>
        {selectedTab === SpaceEditorTab.basicInfo && <VenueWizard />}
      </AdminRestricted>
    </WithNavigationBar>
  );
};
