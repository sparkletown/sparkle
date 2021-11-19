import React, { useMemo } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { adminNGSettingsUrl } from "utils/url";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";

import VenueWizard from "pages/Admin/Venue/VenueWizard/VenueWizard";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import "./SpaceEditor.scss";

export enum SpaceEditorTab {
  basicInfo = "basic-info",
}

export interface SpaceEditorRouteParams {
  spaceSlug?: string;
  selectedTab?: SpaceEditorTab;
}

const spaceEditorTabLabelMap: Readonly<Record<SpaceEditorTab, String>> = {
  [SpaceEditorTab.basicInfo]: "Start",
};

export const SpaceEditor: React.FC = () => {
  const {
    spaceSlug,
    selectedTab = SpaceEditorTab.basicInfo,
  } = useParams<SpaceEditorRouteParams>();

  const { space, isLoaded: isSpaceLoaded } = useSpaceBySlug(spaceSlug);

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
