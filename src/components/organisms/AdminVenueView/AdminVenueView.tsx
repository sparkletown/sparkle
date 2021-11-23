import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { faClock, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import { faBorderNone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { VenueTemplate } from "types/venues";

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

const partySpaceTabLabelMap: Readonly<Record<AdminVenueTab, String>> = {
  [AdminVenueTab.spaces]: "Spaces",
  [AdminVenueTab.timing]: "Timing",
  [AdminVenueTab.run]: "Run",
};

const otherSpaceTabLabelMap: Partial<
  Readonly<Record<AdminVenueTab, String>>
> = {
  [AdminVenueTab.timing]: "Timing",
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

  const isPartySpace = space?.template === VenueTemplate.partymap;

  const currentTab = isPartySpace ? selectedTab : AdminVenueTab.timing;

  const tabLabelMap = isPartySpace
    ? partySpaceTabLabelMap
    : otherSpaceTabLabelMap;

  const { world } = useWorldById(space?.worldId);

  const renderAdminVenueTabs = useMemo(() => {
    return Object.entries(tabLabelMap).map(([key, label]) => (
      <Link
        key={key}
        to={adminNGVenueUrl(spaceSlug, key)}
        className={classNames({
          AdminVenueView__tab: true,
          "AdminVenueView__tab--selected": currentTab === key,
        })}
      >
        <FontAwesomeIcon
          className="AdminVenueView__tabIcon"
          icon={tabIcons[key as AdminVenueTab]}
        />
        {label}
      </Link>
    ));
  }, [currentTab, spaceSlug, tabLabelMap]);

  const navigateToHome = useCallback(
    () => history.push(adminWorldSpacesUrl(world?.slug)),
    [history, world?.slug]
  );

  const navigateToSpaces = useCallback(
    () => history.push(adminNGVenueUrl(spaceSlug, AdminVenueTab.spaces)),
    [history, spaceSlug]
  );

  const navigateToTiming = useCallback(
    () => history.push(adminNGVenueUrl(spaceSlug, AdminVenueTab.timing)),
    [history, spaceSlug]
  );

  const navigateToRun = useCallback(
    () => history.push(adminNGVenueUrl(spaceSlug, AdminVenueTab.run)),
    [history, spaceSlug]
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
        {currentTab === AdminVenueTab.spaces && (
          <Spaces
            onClickHome={navigateToHome}
            onClickBack={navigateToHome}
            onClickNext={navigateToTiming}
            venue={space}
          />
        )}
        {currentTab === AdminVenueTab.timing && (
          <SpaceTimingPanel
            onClickHome={navigateToHome}
            venue={space}
            {...(isPartySpace && {
              onClickBack: navigateToSpaces,
              onClickNext: navigateToRun,
            })}
          />
        )}
        {currentTab === AdminVenueTab.run && (
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
