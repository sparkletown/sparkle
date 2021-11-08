import React, { useCallback, useMemo } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { Venue_v2 } from "types/venues";

import { adminNGSettingsUrl } from "utils/url";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import EntranceExperience from "pages/Admin/EntranceExperience";
import VenueWizard from "pages/Admin/Venue/VenueWizard/VenueWizard";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import "./AdminSpaceSettings.scss";

export enum AdminSpaceSettingsTab {
  basicInfo = "basic-info",
  entranceExperience = "entrance-experience",
}

export interface AdminSpaceSettingsRouteParams {
  venueId?: string;
  selectedTab?: AdminSpaceSettingsTab;
}

const adminAdvancedTabLabelMap: Readonly<
  Record<AdminSpaceSettingsTab, String>
> = {
  [AdminSpaceSettingsTab.basicInfo]: "Start",
  [AdminSpaceSettingsTab.entranceExperience]: "Entrance",
};

export const AdminSpaceSettings: React.FC = () => {
  const history = useHistory();
  const {
    venueId,
    selectedTab = AdminSpaceSettingsTab.basicInfo,
  } = useParams<AdminSpaceSettingsRouteParams>();
  console.log("??");
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
    () =>
      history.push(
        adminNGSettingsUrl(venueId, AdminSpaceSettingsTab.basicInfo)
      ),
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
        <div className="AdminSpaceSettings">
          <div className="AdminSpaceSettings__options">
            {renderAdminAdvancedTabs}
          </div>
        </div>
        {selectedTab === AdminSpaceSettingsTab.basicInfo && <VenueWizard />}
        {selectedTab === AdminSpaceSettingsTab.entranceExperience && (
          <EntranceExperience
            // @debt Venue_v2 has different structure than AnyVenue, 1 of them should be deprecated.
            venue={venue as Venue_v2}
            onSave={navigateToDefaultTab}
          />
        )}
      </AdminRestricted>
    </WithNavigationBar>
  );
};
