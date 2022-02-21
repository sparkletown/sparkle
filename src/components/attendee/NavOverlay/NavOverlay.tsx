import { useEffect, useState } from "react";

import { SPACE_TAXON } from "settings";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useMediaQuery } from "hooks/viewport/useMediaQuery";

import { ScheduleOverlay } from "./ScheduleOverlay/ScheduleOverlay";
import { SearchOverlay } from "./SearchOverlay/SearchOverlay";
import { ProfileOverlay } from "./ProfileOverlay";

import CN from "./NavOverlay.module.scss";

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
    <div className={CN.navOverlay}>
      <div className={CN.navOverlayHeader}>
        {isTabletAndMenuHidden && (
          <div className={CN.navOverlayBack} onClick={() => setMenuShown(true)}>
            <span className={CN.navOverlayBack_icon} />
            Back
          </div>
        )}
        <div className={CN.navOverlayClose} onClick={onClose}>
          Close
          <span className={CN.navOverlayClose_icon} />
        </div>
      </div>
      <div className={CN.navOverlayContainer}>
        {!isTabletAndMenuHidden && (
          <div className={CN.navOverlayNavigation}>
            {Object.entries(navOverlayTypeList).map(([key, label]) => (
              <span
                className={CN.navOverlayNavigation_button}
                key={key}
                onClick={() => handleMenuItemSelect(key)}
              >
                {label}
              </span>
            ))}
          </div>
        )}
        {!(isMenuPaged && isMenuShown) && (
          <div className={CN.navOverlayContent}>
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
