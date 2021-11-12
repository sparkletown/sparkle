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

import "./AdminAdvancedSettings.scss";

export enum AdminAdvancedTab {
  basicInfo = "basic-info",
  advancedMapSettings = "advanced-map-settings",
}

export interface AdminAdvancedSettingsRouteParams {
  venueId?: string;
  selectedTab?: AdminAdvancedTab;
}

const adminAdvancedTabLabelMap: Readonly<Record<AdminAdvancedTab, String>> = {
  [AdminAdvancedTab.basicInfo]: "Start",
  [AdminAdvancedTab.advancedMapSettings]: "Advanced",
};

export const AdminAdvancedSettings: React.FC = () => {
  const history = useHistory();
  const {
    venueId,
    selectedTab = AdminAdvancedTab.basicInfo,
  } = useParams<AdminAdvancedSettingsRouteParams>();

  const {
    currentVenue: venue,
    isCurrentVenueLoaded,
  } = useConnectCurrentVenueNG(venueId);

  const renderAdminAdvancedTabs = useMemo(() => {
    return Object.entries(adminAdvancedTabLabelMap).map(([key, label]) => (
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
    () => history.push(adminNGSettingsUrl(venueId, AdminAdvancedTab.basicInfo)),
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
        <div className="AdminAdvancedSettings">
          <div className="AdminAdvancedSettings__options">
            {renderAdminAdvancedTabs}
          </div>
        </div>
        {selectedTab === AdminAdvancedTab.basicInfo && <VenueWizard />}
        {selectedTab === AdminAdvancedTab.advancedMapSettings && (
          <AdvancedSettings venue={venue} onSave={navigateToDefaultTab} />
        )}
      </AdminRestricted>
    </WithNavigationBar>
  );
};
