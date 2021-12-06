import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ADMIN_IA_WORLD_EDIT_PARAM_URL } from "settings";

import { WorldNavTab } from "types/world";

import { generateUrl } from "utils/url";

import { useWorldParams } from "hooks/worlds/useWorldParams";

import { WorldNavIconMap } from "./WorldNavIconMap";
import { WorldNavLabelMap } from "./WorldNavLabelMap";

import "./WorldNav.scss";

export const WorldNav: React.FC = () => {
  const { worldSlug, selectedTab } = useWorldParams();
  const renderedTabs = useMemo(() => {
    return Object.entries(WorldNavLabelMap).map(([key, label]) => (
      <Link
        key={key}
        to={generateUrl({
          route: ADMIN_IA_WORLD_EDIT_PARAM_URL,
          required: ["worldSlug", "selectedTab"],
          params: { worldSlug, selectedTab: key },
        })}
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
