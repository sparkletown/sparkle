import React, { useMemo, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { adminNGVenueUrl, adminNGRootUrl } from "utils/url";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useUser } from "hooks/useUser";
import { useIsAdminUser } from "hooks/roles";

import { LoadingPage } from "components/molecules/LoadingPage";

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

export const AdminVenueView: React.FC = () => {
  const history = useHistory();
  const {
    venueId,
    selectedTab = AdminVenueTab.spaces,
  } = useParams<AdminVenueViewRouteParams>();

  const { userId } = useUser();
  const { isAdminUser } = useIsAdminUser(userId);

  // Get and pass venue to child components when working on tabs
  const { isCurrentVenueLoaded } = useConnectCurrentVenueNG(venueId);

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
        {label}
      </Link>
    ));
  }, [selectedTab, venueId]);

  useEffect(() => {
    if (venueId) return;
    // when URL is invalid, land on the root one for the admin
    history.push(adminNGRootUrl());
  }, [venueId, history]);

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
      {selectedTab === AdminVenueTab.spaces && <div>Spaces</div>}
      {selectedTab === AdminVenueTab.timing && <div>Timing</div>}
      {selectedTab === AdminVenueTab.run && <div>Run</div>}
    </>
  );
};
