import React, { useMemo } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { adminWorldUrl } from "utils/url";

import { WorldNavIconMap } from "./WorldNavIconMap";
import { WorldNavLabelMap } from "./WorldNavLabelMap";
import { WorldNavTab } from "./WorldNavTab";

import "./WorldNav.scss";

export interface WorldNavRouteParams {
  worldId?: string;
  selectedTab?: WorldNavTab;
}

export const WorldNav: React.FC = () => {
  const {
    worldId,
    selectedTab = WorldNavTab.start,
  } = useParams<WorldNavRouteParams>();
  const renderedTabs = useMemo(() => {
    return Object.entries(WorldNavLabelMap).map(([key, label]) => (
      <Link
        key={key}
        to={adminWorldUrl(worldId, key)}
        className={classNames({
          WorldNav__tab: true,
          "WorldNav__tab--selected": selectedTab === key,
        })}
      >
        <FontAwesomeIcon
          className="WorldNav__icon"
          icon={WorldNavIconMap[key as WorldNavTab]}
        />
        {label}
      </Link>
    ));
  }, [selectedTab, worldId]);

  return <div className="AdminVenueView__options">{renderedTabs}</div>;
};
