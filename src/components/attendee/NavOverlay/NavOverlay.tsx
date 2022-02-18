import { useEffect, useState } from "react";
import cn from "classnames";

import { SPACE_TAXON } from "settings";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

import { ScheduleOverlay } from "./ScheduleOverlay/ScheduleOverlay";
import { SearchOverlay } from "./SearchOverlay/SearchOverlay";

import CN from "./NavOverlay.module.scss";

type navOverlayProps = {
  isShown: boolean;
  onClose: () => void;
  type?: string;
};

export enum NavOverlayTab {
  schedule = "schedule",
  search = "search",
  profile = "profile",
  info = "info",
  help = "help",
}

const navOverlayTypeMap: Readonly<Record<NavOverlayTab, string>> = {
  [NavOverlayTab.schedule]: "Schedule",
  [NavOverlayTab.search]: "Search",
  [NavOverlayTab.profile]: "Profile settings",
  [NavOverlayTab.info]: "What is Sparkle?",
  [NavOverlayTab.help]: "Help",
};

export const NavOverlay: React.FC<navOverlayProps> = ({ onClose, type }) => {
  const [navOverlayType, setNavOverlay] = useState(type);
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  useEffect(() => {
    setNavOverlay(type);

    return () => setNavOverlay("");
  }, [type]);

  const spaceName = space?.name ?? SPACE_TAXON.lower;

  const navOverlayTypeList = {
    [spaceName]: space?.name,
    ...navOverlayTypeMap,
  };

  return (
    <div className={CN.navOverlay}>
      <div className={CN.navOverlayClose} onClick={onClose}>
        Close
        <span className={cn("NavOverlay__close-icon", CN.closeIcon)} />
      </div>
      <div className={CN.navOverlayContainer}>
        <div className={CN.navOverlayNavigation}>
          {Object.entries(navOverlayTypeList).map(([key, label]) => (
            <span
              className={cn(
                "NavOverlay__navigation-button",
                CN.navigationButton
              )}
              key={key}
              onClick={() => setNavOverlay(label)}
            >
              {label}
            </span>
          ))}
        </div>
        <div className={CN.navOverlayContent}>
          {navOverlayType === NavOverlayTab.schedule && <ScheduleOverlay />}
          {navOverlayType === NavOverlayTab.search && (
            <SearchOverlay onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};
