import React, { useCallback, useMemo } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { Venue_v2 } from "types/venues";

import { adminNGSettingsUrl } from "utils/url";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import AdvancedSettings from "pages/Admin/AdvancedSettings";
import EntranceExperience from "pages/Admin/EntranceExperience";
import VenueWizard from "pages/Admin/Venue/VenueWizard/VenueWizard";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import "./AdminAdvancedSettings.scss";

export enum AdminAdvancedTab {
  basicInfo = "basic-info",
  entranceExperience = "entrance-experience",
  advancedMapSettings = "advanced-map-settings",
}

export interface AdminAdvancedSettingsRouteParams {
  worldId?: string;
  selectedTab?: AdminAdvancedTab;
}

const adminAdvancedTabLabelMap: Readonly<Record<AdminAdvancedTab, String>> = {
  [AdminAdvancedTab.basicInfo]: "Start",
  [AdminAdvancedTab.entranceExperience]: "Entrance",
  [AdminAdvancedTab.advancedMapSettings]: "Advanced",
};

export const AdminAdvancedSettings: React.FC = () => {
  const history = useHistory();
  const {
    worldId,
    selectedTab = AdminAdvancedTab.basicInfo,
  } = useParams<AdminAdvancedSettingsRouteParams>();

  const {
    currentVenue: venue,
    isCurrentVenueLoaded,
  } = useConnectCurrentVenueNG(worldId);

  const renderAdminAdvancedTabs = useMemo(() => {
    return Object.entries(adminAdvancedTabLabelMap).map(([key, label]) => (
      <Link
        key={key}
        className={classNames({
          AdminVenueView__tab: true,
          "AdminVenueView__tab--selected": selectedTab === key,
        })}
        to={adminNGSettingsUrl(worldId, key)}
      >
        {label}
      </Link>
    ));
  }, [selectedTab, worldId]);

  const navigateToDefaultTab = useCallback(
    () => history.push(adminNGSettingsUrl(worldId, AdminAdvancedTab.basicInfo)),
    [worldId, history]
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
        <div className="AdminAdvancedSettings">
          <div className="AdminAdvancedSettings__options">
            {renderAdminAdvancedTabs}
          </div>
        </div>
        {selectedTab === AdminAdvancedTab.basicInfo && <VenueWizard />}
        {selectedTab === AdminAdvancedTab.entranceExperience && (
          <EntranceExperience
            // @debt Venue_v2 has different structure than AnyVenue, 1 of them should be deprecated.
            venue={venue as Venue_v2}
            onSave={navigateToDefaultTab}
          />
        )}
        {selectedTab === AdminAdvancedTab.advancedMapSettings && (
          <AdvancedSettings venue={venue} onSave={navigateToDefaultTab} />
        )}
      </AdminRestricted>
    </WithNavigationBar>
  );
};
