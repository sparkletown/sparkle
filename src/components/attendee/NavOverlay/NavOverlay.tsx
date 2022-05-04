import { useEffect, useState } from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { ProfileOverlay } from "components/attendee/ProfileOverlay";
import { ScheduleOverlay } from "components/attendee/ScheduleOverlay/ScheduleOverlay";
import { SearchOverlay } from "components/attendee/SearchOverlay/SearchOverlay";
import { SpaceInfo } from "components/attendee/SpaceInfo";

import { SPACE_TAXON } from "settings";

import { KEYS, useKeyboardKeys } from "hooks/keyboard/useKeyboardKeys";
import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useKeyPress } from "hooks/useKeyPress";
import { useDisableBodyScroll } from "hooks/viewport/useDisableBodyScroll";
import { useMediaQuery } from "hooks/viewport/useMediaQuery";

import CN from "./NavOverlay.module.scss";

type NavOverlayProps = {
  onClose: () => void;
  type?: string;
  isBannerOn?: boolean;
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

export const NavOverlay: React.FC<NavOverlayProps> = ({
  onClose,
  type,
  isBannerOn,
}) => {
  const [selectedNavMenu, setNavMenu] = useState(type);
  const [isMenuShown, setMenuShown] = useState(true);
  const { isTablet, isMobile } = useMediaQuery();
  const { space } = useWorldAndSpaceByParams();

  const isMenuPaged = isTablet || isMobile;

  useEffect(() => {
    setNavMenu(type);

    return () => setNavMenu("");
  }, [type]);

  useDisableBodyScroll({ isOpen: true });

  const handleMenuItemSelect = (key: string) => {
    setNavMenu(key);
    isMenuPaged && setMenuShown(false);
  };

  const spaceName = space?.name ?? SPACE_TAXON.lower;

  const navOverlayTypeList = {
    [spaceName]: space?.name,
    ...navOverlayTypeMap,
  };

  const handleKeyPress = useKeyPress({
    keys: [KEYS.ESCAPE_KEY],
    onPress: onClose,
  });

  useKeyboardKeys({ handleKeyPress });

  const isTabletAndMenuHidden = isMenuPaged && !isMenuShown;

  const overlayClasses = classNames(CN.navOverlay, {
    [CN.blur]: isBannerOn,
  });
  return (
    <div className={overlayClasses}>
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
            {selectedNavMenu === space?.name && <SpaceInfo space={space} />}
            {selectedNavMenu === NavOverlayTabType.schedule && (
              <ScheduleOverlay />
            )}
            {selectedNavMenu === NavOverlayTabType.search && (
              <SearchOverlay onClose={onClose} setNavMenu={setNavMenu} />
            )}
            {selectedNavMenu === NavOverlayTabType.profile && (
              <ProfileOverlay onOverlayClose={onClose} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
