import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { faChartBar } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRightArrowLeft,
  faCalendar,
  faGear,
  faMap,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import {
  ADMIN_IA_WORLD_BASE_URL,
  ADMIN_IA_WORLD_PARAM_URL,
  ADMIN_IA_WORLD_REPORTS,
  ADMIN_IA_WORLD_SCHEDULE,
  ADMIN_IA_WORLD_SETTINGS,
  ADMIN_IA_WORLD_USERS,
} from "settings";

import { generateUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { AdminSidebarProfile } from "components/molecules/AdminSidebarProfile";

import * as TW from "./SidebarContent.tailwind";

import SparkleLogo from "assets/icons/sparkle-300.png";

const navigation = [
  {
    name: "Spaces",
    route: ADMIN_IA_WORLD_PARAM_URL,
    icon: faMap,
  },
  {
    name: "World Schedule",
    route: ADMIN_IA_WORLD_SCHEDULE,
    icon: faCalendar,
  },
  { name: "Users", route: ADMIN_IA_WORLD_USERS, icon: faUserGroup },
  // @debt use "chart-simple" icon instead once fontawesome upgraded
  { name: "Reports", route: ADMIN_IA_WORLD_REPORTS, icon: faChartBar },
  { name: "Settings", route: ADMIN_IA_WORLD_SETTINGS, icon: faGear },
];

export const SidebarContent = () => {
  const { worldSlug } = useSpaceParams();
  const { world } = useWorldBySlug({ worldSlug });

  const isWorldChosen = !!worldSlug;

  const location = useLocation();

  const renderedMenu = useMemo(
    () =>
      navigation.map((item) => {
        const targetUrl = generateUrl({
          route: item.route,
          required: ["worldSlug"],
          params: { worldSlug },
        });

        const isCurrentRoute = targetUrl === location.pathname;

        const linkClasses = classNames(TW.menuLinkGeneral, {
          [TW.menuLinkCurrent]: isCurrentRoute,
          [TW.menuLinkNotCurrent]: !isCurrentRoute,
        });

        const iconClasses = classNames(TW.menuIconGeneral, {
          [TW.menuIconCurrent]: isCurrentRoute,
          [TW.menuIconNotCurrent]: !isCurrentRoute,
        });

        return (
          <Link to={targetUrl} key={item.name} className={linkClasses}>
            <FontAwesomeIcon
              className={iconClasses}
              aria-hidden="true"
              icon={item.icon}
            />
            {item.name}
          </Link>
        );
      }),
    [location.pathname, worldSlug]
  );

  const switchWorldLinkClasses = classNames(TW.linkGeneral, {
    [TW.linkWorldIsChosen]: isWorldChosen,
    [TW.linkWorldIsNotChosen]: !isWorldChosen,
  });

  const switchWorldIconClasses = classNames(TW.switchWorldIconGeneral, {
    [TW.switchWorldIconChosen]: isWorldChosen,
    [TW.switchWorldIconNotChosen]: !isWorldChosen,
  });

  return (
    <div className="SidebarContent flex-1 flex flex-col min-h-0 bg-gray-800">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <img className="block h-8 w-auto" src={SparkleLogo} alt="Sparkle" />
        </div>
        {isWorldChosen && (
          <nav className="mt-5 px-2 space-y-1">
            <h3 className="flex-1 flex flex-col overflow-y-auto px-2 py-1 text-sm text-gray-400 uppercase tracking-wider">
              {world?.name}
            </h3>
            {renderedMenu}
          </nav>
        )}
      </div>

      <div className="flex-shrink-0">
        <div className="flex-1 flex flex-col overflow-y-auto px-2 py-2">
          <Link to={ADMIN_IA_WORLD_BASE_URL} className={switchWorldLinkClasses}>
            <FontAwesomeIcon
              className={switchWorldIconClasses}
              aria-hidden="true"
              icon={faArrowRightArrowLeft}
            />
            Switch world
          </Link>
        </div>

        <AdminSidebarProfile />
      </div>
    </div>
  );
};
