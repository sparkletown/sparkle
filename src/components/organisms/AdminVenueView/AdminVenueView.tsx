import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { faClock, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import { faBorderNone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { adminNGRootUrl, adminNGVenueUrl } from "utils/url";

import { useIsAdminUser } from "hooks/roles";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useUser } from "hooks/useUser";

import { LoadingPage } from "components/molecules/LoadingPage";

import { RunTabView } from "./components/RunTabView/RunTabView";
import { Spaces } from "./components/Spaces";
import { Timing } from "./components/Timing";

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

export interface TabNavigationProps {
  onClickHome: () => void;
  onClickBack: () => void;
  onClickNext: () => void;
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

  const { userId } = useUser();
  const { isAdminUser } = useIsAdminUser(userId);

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

  const navigateToHome = useCallback(() => history.push(adminNGRootUrl()), [
    history,
  ]);

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

  if (!isAdminUser) {
    return <>Forbidden</>;
  }

  return (
    <>
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
        <Timing
          onClickHome={navigateToHome}
          onClickBack={navigateToSpaces}
          onClickNext={navigateToRun}
          venue={venue}
        />
      )}
      {selectedTab === AdminVenueTab.run && <RunTabView />}
    </>
  );
};
