import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ADMIN_IA_WORLD_EDIT_PARAM_URL } from "settings";

import { WorldNavTab } from "types/world";

import { generateUrl } from "utils/url";

import { useWorldParams } from "hooks/worlds/useWorldParams";

import * as TW from "./WorldNav.tailwind";
import { WorldNavIconMap } from "./WorldNavIconMap";
import { WorldNavLabelMap } from "./WorldNavLabelMap";

import "./WorldNav.scss";

export const WorldNav: React.FC = () => {
  const { worldSlug, selectedTab } = useWorldParams();

  const renderedTabs = useMemo(() => {
    return Object.entries(WorldNavLabelMap).map(([key, label]) => {
      const url = generateUrl({
        route: ADMIN_IA_WORLD_EDIT_PARAM_URL,
        required: ["worldSlug", "selectedTab"],
        params: { worldSlug, selectedTab: key },
      });

      const classes = classNames(TW.tab, {
        [TW.selectedTab]: selectedTab === key,
        [TW.notSelectedTab]: selectedTab !== key,
      });

      const icon = WorldNavIconMap[key as WorldNavTab];

      return (
        <Link key={key} to={url} className={classes}>
          <FontAwesomeIcon className="WorldNav__icon" icon={icon} />
          {label}
        </Link>
      );
    });
  }, [selectedTab, worldSlug]);

  return (
    <div className="AdminVenueView__options -mb-px flex bg-white shadow">
      {renderedTabs}
    </div>
  );
};
