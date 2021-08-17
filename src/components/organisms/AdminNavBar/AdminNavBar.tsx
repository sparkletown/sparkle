import React, { useMemo } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { faClock, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import { faBorderNone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { adminNGVenueUrl } from "utils/url";

import "./AdminNavBar.scss";

export enum AdminNavBarTab {
  spaces = "spaces",
  timing = "timing",
  run = "run",
}

const adminVenueTabLabelMap: Readonly<Record<AdminNavBarTab, String>> = {
  [AdminNavBarTab.spaces]: "Spaces",
  [AdminNavBarTab.timing]: "Timing",
  [AdminNavBarTab.run]: "Run",
};

export interface AdminNavBarRouteParams {
  venueId?: string;
  selectedTab?: AdminNavBarTab;
}

const tabIcons = {
  [AdminNavBarTab.spaces]: faBorderNone,
  [AdminNavBarTab.timing]: faClock,
  [AdminNavBarTab.run]: faPlayCircle,
};

export interface AdminNavBarProps {}

export const AdminNavBar: React.FC<AdminNavBarProps> = ({ children }) => {
  const {
    venueId,
    selectedTab = AdminNavBarTab.run,
  } = useParams<AdminNavBarRouteParams>();

  const renderAdminNavBarOptions = useMemo(() => {
    return Object.entries(adminVenueTabLabelMap).map(([key, label]) => (
      <Link
        key={key}
        to={adminNGVenueUrl(venueId, key)}
        className={classNames({
          AdminNavBar__tab: true,
          "AdminNavBar__tab--selected": selectedTab === key,
        })}
      >
        <FontAwesomeIcon
          className="AdminNavBar__tabIcon"
          icon={tabIcons[key as AdminNavBarTab]}
        />
        {label}
      </Link>
    ));
  }, [selectedTab, venueId]);

  return (
    <div>
      <div className="AdminNavBar">
        <div className="AdminNavBar__options">{renderAdminNavBarOptions}</div>
      </div>
      {children}
    </div>
  );
};
