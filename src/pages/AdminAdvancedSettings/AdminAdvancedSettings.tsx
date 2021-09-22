import React, { useCallback, useMemo } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { Venue_v2 } from "types/venues";

import { adminNGSettingsUrl } from "utils/url";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useRelatedVenues } from "hooks/useRelatedVenues";

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
  venueId?: string;
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
    venueId,
    selectedTab = AdminAdvancedTab.basicInfo,
  } = useParams<AdminAdvancedSettingsRouteParams>();

  const { sovereignVenue } = useRelatedVenues();

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

  return (
    <WithNavigationBar
      hasBackButton={false}
      withSchedule={false}
      withPhotobooth={false}
    >
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
            sovereignVenue={sovereignVenue}
            onSave={navigateToDefaultTab}
          />
        )}
        {selectedTab === AdminAdvancedTab.advancedMapSettings && (
          <AdvancedSettings
            venue={venue as Venue_v2}
            onSave={navigateToDefaultTab}
          />
        )}
      </AdminRestricted>
    </WithNavigationBar>
  );
};
