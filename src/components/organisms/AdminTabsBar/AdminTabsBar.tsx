import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { faClock, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faBorderNone,
  faSlidersH,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { adminNGSettingsUrl, adminNGVenueUrl } from "utils/url";

import "./AdminTabsBar.scss";

export enum AdminTabsBarTab {
  spaces = "spaces",
  timing = "timing",
  run = "run",
  advanceSetting = "advance",
}

const adminVenueTabLabelMap: Readonly<Record<AdminTabsBarTab, String>> = {
  [AdminTabsBarTab.spaces]: "Spaces",
  [AdminTabsBarTab.timing]: "Timing",
  [AdminTabsBarTab.run]: "Run",
  [AdminTabsBarTab.advanceSetting]: "Advance setting",
};

export interface AdminNavBarRouteParams {
  venueId?: string;
  selectedTab?: AdminTabsBarTab;
}

const tabIcons: Record<string, IconDefinition> = {
  [AdminTabsBarTab.spaces]: faBorderNone,
  [AdminTabsBarTab.timing]: faClock,
  [AdminTabsBarTab.run]: faPlayCircle,
  [AdminTabsBarTab.advanceSetting]: faSlidersH,
};

export interface AdminTabsBarProps {
  activeNav?: string;
}

export const AdminTabsBar: React.FC<AdminTabsBarProps> = ({
  activeNav = "",
  children,
}) => {
  const { venueId } = useParams<AdminNavBarRouteParams>();

  const adminTabsUrl = useCallback(
    (key: string) => {
      return key === AdminTabsBarTab.advanceSetting
        ? adminNGSettingsUrl(venueId)
        : adminNGVenueUrl(venueId, key);
    },
    [venueId]
  );

  const renderAdminNavBarOptions = useMemo(() => {
    return Object.entries(adminVenueTabLabelMap).map(([key, label]) => (
      <Link
        key={key}
        to={adminTabsUrl(key)}
        className={classNames({
          AdminNavBar__tab: true,
          "AdminNavBar__tab--selected": activeNav === key,
        })}
      >
        <FontAwesomeIcon
          className="AdminNavBar__tabIcon"
          icon={tabIcons[key as AdminTabsBarTab]}
        />
        {label}
      </Link>
    ));
  }, [activeNav, adminTabsUrl]);

  return (
    <div>
      <div className="AdminNavBar">
        <div className="AdminNavBar__options">{renderAdminNavBarOptions}</div>
      </div>
      {children}
    </div>
  );
};
