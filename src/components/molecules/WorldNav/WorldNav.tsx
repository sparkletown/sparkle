import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { WorldNavTab } from "types/world";

import { adminWorldUrl } from "utils/url";

import { useWorldEditParams } from "hooks/useWorldEditParams";

import { WorldNavIconMap } from "./WorldNavIconMap";
import { WorldNavLabelMap } from "./WorldNavLabelMap";

import "./WorldNav.scss";

export const WorldNav: React.FC = () => {
  const { worldSlug, selectedTab } = useWorldEditParams();
  const renderedTabs = useMemo(() => {
    return Object.entries(WorldNavLabelMap).map(([key, label]) => (
      <Link
        key={key}
        to={worldSlug ? adminWorldUrl(worldSlug, key) : "#"}
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
  }, [selectedTab, worldSlug]);

  return <div className="AdminVenueView__options">{renderedTabs}</div>;
};
