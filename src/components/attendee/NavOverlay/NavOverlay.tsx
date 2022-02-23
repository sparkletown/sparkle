import { useState } from "react";
import cn from "classnames";

import { SPACE_TAXON } from "settings";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { ScheduleOverlay } from "./ScheduleOverlay/ScheduleOverlay";

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

const navOverlayTypeMap: Readonly<Record<NavOverlayTab, String>> = {
  [NavOverlayTab.schedule]: "Schedule",
  [NavOverlayTab.search]: "Search",
  [NavOverlayTab.profile]: "Profile settings",
  [NavOverlayTab.info]: "What is Sparkle?",
  [NavOverlayTab.help]: "Help",
};

export const NavOverlay: React.FC<navOverlayProps> = ({
  isShown,
  onClose,
  type,
}) => {
  const [navOverlayType, setnavOverlay] = useState(
    type ?? navOverlayTypeMap.schedule
  );
  const { space } = useWorldAndSpaceByParams();

  if (!isShown) {
    return null;
  }

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
              onClick={() => setnavOverlay(label)}
            >
              {label}
            </span>
          ))}
        </div>
        <div className={CN.navOverlayContent}>
          {navOverlayType === "Schedule" && <ScheduleOverlay />}
        </div>
      </div>
    </div>
  );
};
