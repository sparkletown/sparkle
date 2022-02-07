import { useState } from "react";

import { SPACE_TAXON } from "settings";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

import { ScheduleOverlay } from "./ScheduleOverlay/ScheduleOverlay";

import styles from "./Overlay.module.scss";

type OverlayProps = {
  isShown: boolean;
  onClose: () => void;
  type?: string;
};

export enum OverlayTab {
  schedule = "schedule",
  search = "search",
  profile = "profile",
  info = "info",
  help = "help",
}

const overlayTypeMap: Readonly<Record<OverlayTab, String>> = {
  [OverlayTab.schedule]: "Schedule",
  [OverlayTab.search]: "Search",
  [OverlayTab.profile]: "Profile settings",
  [OverlayTab.info]: "What is Sparkle?",
  [OverlayTab.help]: "Help",
};

export const Overlay: React.FC<OverlayProps> = ({ isShown, onClose, type }) => {
  const [overlayType, setOverlay] = useState(type ?? overlayTypeMap.schedule);
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  if (!isShown) {
    return null;
  }

  const spaceName = space?.name ?? SPACE_TAXON.lower;

  const overlayTypeList = {
    [spaceName]: space?.name,
    ...overlayTypeMap,
  };

  return (
    <div className={styles.Overlay}>
      <div className={styles.Overlay__close} onClick={onClose}>
        Close
        <span className={styles.Overlay__close_icon} />
      </div>
      <div className={styles.Overlay__container}>
        <div className={styles.Overlay__navigation}>
          {Object.entries(overlayTypeList).map(([key, label]) => (
            <span
              className={styles.Overlay__navigation_button}
              key={key}
              onClick={() => setOverlay(label)}
            >
              {label}
            </span>
          ))}
        </div>
        <div className={styles.Overlay__content}>
          {overlayType === "Schedule" && <ScheduleOverlay />}
        </div>
      </div>
    </div>
  );
};
