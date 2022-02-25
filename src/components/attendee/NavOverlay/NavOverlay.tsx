import { useEffect, useState } from "react";
import cn from "classnames";

import { SPACE_TAXON } from "settings";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { ScheduleOverlay } from "./ScheduleOverlay/ScheduleOverlay";
import { SearchOverlay } from "./SearchOverlay/SearchOverlay";

import CN from "./NavOverlay.module.scss";

type NavOverlayProps = {
  onClose: () => void;
  type?: string;
};

export enum NavOverlayTabType {
  schedule = "schedule",
  search = "search",
  profile = "profile",
  info = "info",
  help = "help",
}

const navOverlayTypeMap: Readonly<Record<NavOverlayTabType, string>> = {
  [NavOverlayTabType.schedule]: "Schedule",
  [NavOverlayTabType.search]: "Search",
  [NavOverlayTabType.profile]: "Profile settings",
  [NavOverlayTabType.info]: "What is Sparkle?",
  [NavOverlayTabType.help]: "Help",
};

export const NavOverlay: React.FC<NavOverlayProps> = ({ onClose, type }) => {
  const [navOverlayType, setNavOverlay] = useState(type);
  const { space } = useWorldAndSpaceByParams();

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
              onClick={() => setNavOverlay(key)}
            >
              {label}
            </span>
          ))}
        </div>
        <div className={CN.navOverlayContent}>
          {navOverlayType === NavOverlayTabType.schedule && <ScheduleOverlay />}
          {navOverlayType === NavOverlayTabType.search && (
            <SearchOverlay onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};
