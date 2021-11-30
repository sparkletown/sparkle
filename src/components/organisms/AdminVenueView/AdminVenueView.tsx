import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { faClock, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import { faBorderNone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { adminNGVenueUrl, adminWorldSpacesUrl } from "utils/url";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useWorldById } from "hooks/worlds/useWorldById";

import { SpaceTimingPanel } from "components/organisms/AdminVenueView/components/SpaceTimingPanel";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { NotFound } from "components/atoms/NotFound";

import { WithNavigationBar } from "../WithNavigationBar";

import { RunTabView } from "./components/RunTabView";
import { Spaces } from "./components/Spaces";

import "./AdminVenueView.scss";

export enum AdminVenueTab {
  spaces = "spaces",
  timing = "timing",
  run = "run",
}

export interface AdminVenueViewRouteParams {
  spaceSlug?: string;
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
    spaceSlug,
    selectedTab = AdminVenueTab.spaces,
  } = useParams<AdminVenueViewRouteParams>();

  const { space, isLoaded: isSpaceLoaded } = useSpaceBySlug(spaceSlug);

  const { world } = useWorldById(space?.worldId);

  const worldSlug = world?.slug;

  const renderAdminVenueTabs = useMemo(() => {
    return Object.entries(adminVenueTabLabelMap).map(([key, label]) => (
      <Link
        key={key}
        to={adminNGVenueUrl(worldSlug, spaceSlug, key)}
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
  }, [selectedTab, spaceSlug, worldSlug]);

  const navigateToHome = useCallback(
    () => history.push(adminWorldSpacesUrl(worldSlug)),
    [history, worldSlug]
  );

  const navigateToSpaces = useCallback(
    () =>
      history.push(adminNGVenueUrl(worldSlug, spaceSlug, AdminVenueTab.spaces)),
    [history, spaceSlug, worldSlug]
  );

  const navigateToTiming = useCallback(
    () =>
      history.push(adminNGVenueUrl(worldSlug, spaceSlug, AdminVenueTab.timing)),
    [history, spaceSlug, worldSlug]
  );

  const navigateToRun = useCallback(
    () =>
      history.push(adminNGVenueUrl(worldSlug, spaceSlug, AdminVenueTab.run)),
    [history, spaceSlug, worldSlug]
  );

  if (!isSpaceLoaded) {
    return <LoadingPage />;
  }

  if (!space) {
    return (
      <WithNavigationBar withSchedule withHiddenLoginButton>
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
            venue={space}
          />
        )}
        {selectedTab === AdminVenueTab.timing && (
          <SpaceTimingPanel
            onClickHome={navigateToHome}
            onClickBack={navigateToSpaces}
            onClickNext={navigateToRun}
            venue={space}
          />
        )}
        {selectedTab === AdminVenueTab.run && (
          <RunTabView
            onClickHome={navigateToHome}
            onClickBack={navigateToTiming}
            onClickNext={navigateToHome}
            venue={space}
          />
        )}
      </AdminRestricted>
    </WithNavigationBar>
  );
};
