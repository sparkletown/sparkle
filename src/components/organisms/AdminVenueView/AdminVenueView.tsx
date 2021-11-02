import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { faClock, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import { faBorderNone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { adminNGVenueUrl, adminWorldSpacesUrl } from "utils/url";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { NotFound } from "components/atoms/NotFound";

import { WithNavigationBar } from "../WithNavigationBar";

import { RunTabView } from "./components/RunTabView";
import { Spaces } from "./components/Spaces";
import { SpaceTimingPanel } from "./components/Timing/SpaceTimingPanel";

import "./AdminVenueView.scss";

export enum AdminVenueTab {
  spaces = "spaces",
  timing = "timing",
  run = "run",
}

export interface AdminVenueViewRouteParams {
  venueId?: string;
  selectedTab?: AdminVenueTab;
}

const adminVenueTabLabelMap: Readonly<Record<AdminVenueTab, String>> = {
  [AdminVenueTab.spaces]: "Spaces",
  [AdminVenueTab.timing]: "Timing",
  [AdminVenueTab.run]: "Run",
};

const tabIcons = {
  [AdminVenueTab.spaces]: faBorderNone,
  [AdminVenueTab.timing]: faClock,
  [AdminVenueTab.run]: faPlayCircle,
};

export const AdminVenueView: React.FC = () => {
  const history = useHistory();
  const {
    venueId,
    selectedTab = AdminVenueTab.spaces,
  } = useParams<AdminVenueViewRouteParams>();

  // Get and pass venue to child components when working on tabs
  const {
    isCurrentVenueLoaded,
    currentVenue: venue,
  } = useConnectCurrentVenueNG(venueId);

  const renderAdminVenueTabs = useMemo(() => {
    return Object.entries(adminVenueTabLabelMap).map(([key, label]) => (
      <Link
        key={key}
        to={adminNGVenueUrl(venueId, key)}
        className={classNames({
          AdminVenueView__tab: true,
          "AdminVenueView__tab--selected": selectedTab === key,
        })}
      >
        <FontAwesomeIcon
          className="AdminVenueView__tabIcon"
          icon={tabIcons[key as AdminVenueTab]}
        />
        {label}
      </Link>
    ));
  }, [selectedTab, venueId]);

  const navigateToHome = useCallback(
    () => history.push(adminWorldSpacesUrl(venue?.worldId)),
    [history, venue?.worldId]
  );

  const navigateToSpaces = useCallback(
    () => history.push(adminNGVenueUrl(venueId, AdminVenueTab.spaces)),
    [history, venueId]
  );

  const navigateToTiming = useCallback(
    () => history.push(adminNGVenueUrl(venueId, AdminVenueTab.timing)),
    [history, venueId]
  );

  const navigateToRun = useCallback(
    () => history.push(adminNGVenueUrl(venueId, AdminVenueTab.run)),
    [history, venueId]
  );

  if (!isCurrentVenueLoaded) {
    return <LoadingPage />;
  }

  if (!venue) {
    return (
      <WithNavigationBar withSchedule>
        <AdminRestricted>
          <NotFound />
        </AdminRestricted>
      </WithNavigationBar>
    );
  }

  return (
    <WithNavigationBar withSchedule>
      <AdminRestricted>
        <div className="AdminVenueView">
          <div className="AdminVenueView__options">{renderAdminVenueTabs}</div>
        </div>
        {selectedTab === AdminVenueTab.spaces && (
          <Spaces
            onClickHome={navigateToHome}
            onClickBack={navigateToHome}
            onClickNext={navigateToTiming}
            venue={venue}
          />
        )}
        {selectedTab === AdminVenueTab.timing && (
          <SpaceTimingPanel
            onClickHome={navigateToHome}
            onClickBack={navigateToSpaces}
            onClickNext={navigateToRun}
            venue={venue}
          />
        )}
        {selectedTab === AdminVenueTab.run && (
          <RunTabView
            onClickHome={navigateToHome}
            onClickBack={navigateToTiming}
            onClickNext={navigateToHome}
            venue={venue}
          />
        )}
      </AdminRestricted>
    </WithNavigationBar>
  );
};
