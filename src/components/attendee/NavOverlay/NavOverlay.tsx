import { useState } from "react";

import { SPACE_TAXON } from "settings";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

import { ScheduleOverlay } from "./ScheduleOverlay/ScheduleOverlay";

import styles from "./NavOverlay.module.scss";

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
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  if (!isShown) {
    return null;
  }

  const spaceName = space?.name ?? SPACE_TAXON.lower;

  const navOverlayTypeList = {
    [spaceName]: space?.name,
    ...navOverlayTypeMap,
  };

  return (
    <div className={styles.navOverlay}>
      <div className={styles.navOverlay__close} onClick={onClose}>
        Close
        <span className={styles.navOverlay__close_icon} />
      </div>
      <div className={styles.navOverlay__container}>
        <div className={styles.navOverlay__navigation}>
          {Object.entries(navOverlayTypeList).map(([key, label]) => (
            <span
              className={styles.navOverlay__navigation_button}
              key={key}
              onClick={() => setnavOverlay(label)}
            >
              {label}
            </span>
          ))}
        </div>
        <div className={styles.navOverlay__content}>
          {navOverlayType === "Schedule" && <ScheduleOverlay />}
        </div>
      </div>
    </div>
  );
};
