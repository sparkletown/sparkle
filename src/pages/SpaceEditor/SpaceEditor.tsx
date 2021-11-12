import React, { useCallback, useMemo } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { adminNGSettingsUrl } from "utils/url";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import AdvancedSettings from "pages/Admin/AdvancedSettings";
import VenueWizard from "pages/Admin/Venue/VenueWizard/VenueWizard";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import "./SpaceEditor.scss";

export enum SpaceEditorTab {
  basicInfo = "basic-info",
  advancedMapSettings = "advanced-map-settings",
}

export interface SpaceEditorRouteParams {
  venueId?: string;
  selectedTab?: SpaceEditorTab;
}

const spaceEditorTabLabelMap: Readonly<Record<SpaceEditorTab, String>> = {
  [SpaceEditorTab.basicInfo]: "Start",
  [SpaceEditorTab.advancedMapSettings]: "Advanced",
};

export const SpaceEditor: React.FC = () => {
  const history = useHistory();
  const {
    venueId,
    selectedTab = SpaceEditorTab.basicInfo,
  } = useParams<SpaceEditorRouteParams>();

  const {
    currentVenue: venue,
    isCurrentVenueLoaded,
  } = useConnectCurrentVenueNG(venueId);

  const renderedSpaceEditorTabs = useMemo(() => {
    return Object.entries(spaceEditorTabLabelMap).map(([key, label]) => (
      <Link
        key={key}
        className={classNames({
          AdminVenueView__tab: true,
          "AdminVenueView__tab--selected": selectedTab === key,
        })}
        to={adminNGSettingsUrl(venueId, key)}
      >
        {label}
      </Link>
    ));
  }, [selectedTab, venueId]);

  const navigateToDefaultTab = useCallback(
    () => history.push(adminNGSettingsUrl(venueId, SpaceEditorTab.basicInfo)),
    [venueId, history]
  );

  if (!isCurrentVenueLoaded) {
    return <LoadingPage />;
  }

  if (!venue) {
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
        {selectedTab === SpaceEditorTab.advancedMapSettings && (
          <AdvancedSettings venue={venue} onSave={navigateToDefaultTab} />
        )}
      </AdminRestricted>
    </WithNavigationBar>
  );
};
