import { useEffect, useState } from "react";

import { SPACE_TAXON } from "settings";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useMediaQuery } from "hooks/viewport/useMediaQuery";

import { ScheduleOverlay } from "./ScheduleOverlay/ScheduleOverlay";
import { SearchOverlay } from "./SearchOverlay/SearchOverlay";
import { ProfileOverlay } from "./ProfileOverlay";

import styles from "./NavOverlay.module.scss";

type navOverlayProps = {
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

export const NavOverlay: React.FC<navOverlayProps> = ({ onClose, type }) => {
  const [navOverlayType, setNavOverlay] = useState(type);
  const [isMenuShown, setMenuShown] = useState(true);
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { isTablet, isMobile } = useMediaQuery();
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  const isMenuPaged = isTablet || isMobile;

  useEffect(() => {
    setNavOverlay(type);

    return () => setNavOverlay("");
  }, [type]);

  const handleMenuItemSelect = (key: string) => {
    setNavOverlay(key);
    isMenuPaged && setMenuShown(false);
  };

  const spaceName = space?.name ?? SPACE_TAXON.lower;

  const navOverlayTypeList = {
    [spaceName]: space?.name,
    ...navOverlayTypeMap,
  };

  const isTabletAndMenuHidden = isMenuPaged && !isMenuShown;

  return (
    <div className={styles.NavOverlay}>
      <div className={styles.NavOverlay__header}>
        {isTabletAndMenuHidden && (
          <div
            className={styles.NavOverlay__back}
            onClick={() => setMenuShown(true)}
          >
            <span className={styles.NavOverlay__back_icon} />
            Back
          </div>
        )}
        <div className={styles.NavOverlay__close} onClick={onClose}>
          Close
          <span className={styles.NavOverlay__close_icon} />
        </div>
      </div>
      <div className={styles.NavOverlay__container}>
        {!isTabletAndMenuHidden && (
          <div className={styles.NavOverlay__navigation}>
            {Object.entries(navOverlayTypeList).map(([key, label]) => (
              <span
                className={styles.NavOverlay__navigation_button}
                key={key}
                onClick={() => handleMenuItemSelect(key)}
              >
                {label}
              </span>
            ))}
          </div>
        )}
        {!(isMenuPaged && isMenuShown) && (
          <div className={styles.NavOverlay__content}>
            {navOverlayType === NavOverlayTab.schedule && <ScheduleOverlay />}
            {navOverlayType === NavOverlayTab.search && (
              <SearchOverlay onClose={onClose} />
            )}
            {navOverlayType === NavOverlayTab.profile && <ProfileOverlay />}
          </div>
        )}
      </div>
    </div>
  );
};
