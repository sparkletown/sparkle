import { useEffect, useState } from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProfileOverlay } from "components/attendee/ProfileOverlay";
import { ScheduleOverlay } from "components/attendee/ScheduleOverlay/ScheduleOverlay";
import { SearchOverlay } from "components/attendee/SearchOverlay/SearchOverlay";
import { SpaceInfo } from "components/attendee/SpaceInfo";

import { SPACE_TAXON } from "settings";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useDisableBodyScroll } from "hooks/viewport/useDisableBodyScroll";
import { useMediaQuery } from "hooks/viewport/useMediaQuery";

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
  const [selectedNavMenu, setNavMenu] = useState(type);
  const [isMenuShown, setMenuShown] = useState(true);
  const { isTablet, isMobile } = useMediaQuery();
  const { space } = useWorldAndSpaceByParams();

  const isMenuPaged = isTablet || isMobile;

  useEffect(() => {
    setNavMenu(type);

    return () => setNavMenu("");
  }, [type]);

  const isModalOpen = !!isMenuShown;
  useDisableBodyScroll(isModalOpen);

  const handleMenuItemSelect = (key: string) => {
    setNavMenu(key);
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
            <FontAwesomeIcon
              icon={faArrowLeft}
              className={CN.navOverlayBackIcon}
            />
            Back
          </div>
        )}
        <div className={CN.navOverlayClose} onClick={onClose}>
          Close
          <span className={CN.closeIcon} />
        </div>
      </div>
      <div className={CN.navOverlayContainer}>
        {!isTabletAndMenuHidden && (
          <div className={CN.navOverlayNavigation}>
            {Object.entries(navOverlayTypeList).map(([key, label]) => (
              <span
                className={CN.navigationButton}
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
            {selectedNavMenu === space?.name && <SpaceInfo />}
            {selectedNavMenu === NavOverlayTabType.schedule && (
              <ScheduleOverlay />
            )}
            {selectedNavMenu === NavOverlayTabType.search && (
              <SearchOverlay onClose={onClose} />
            )}
            {selectedNavMenu === NavOverlayTabType.profile && (
              <ProfileOverlay />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
