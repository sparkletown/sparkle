import { useState } from "react";
import classNames from "classnames";

import { SPACE_TAXON } from "settings";

import { formatFullTimeLocalised } from "utils/time";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useShowHide } from "hooks/useShowHide";
import { useMediaQuery } from "hooks/viewport/useMediaQuery";

import { Button } from "../Button/Button";
import { NavOverlay } from "../NavOverlay/NavOverlay";

import styles from "./AttendeeHeader.module.scss";

export enum HeaderTab {
  schedule = "schedule",
  search = "search",
  profile = "profile",
}

const headerTypeMap: Readonly<Record<HeaderTab, String>> = {
  [HeaderTab.schedule]: "Schedule",
  [HeaderTab.search]: "Search",
  [HeaderTab.profile]: "Profile",
};

export const AttendeeHeader = () => {
  const { isShown, hide, show } = useShowHide(false);
  const [overlayLabel, setOverlayLabel] = useState("");
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { isTablet, isMobile } = useMediaQuery();
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  const handleOverlayOpen = (key: string) => {
    setOverlayLabel(key);
    show();
  };

  const isNarrow = isTablet || isMobile;

  const containerClasses = classNames(styles.AttendeeHeader__container, {
    [styles.AttendeeHeader__container_narrow]: isNarrow,
  });

  return (
    <header className={styles.AttendeeHeader}>
      <div className={containerClasses}>
        <div>
          <Button variant={isNarrow ? "primaryAlternate" : "primary"}>
            {space?.name ?? `This ${SPACE_TAXON.title}`}{" "}
            {formatFullTimeLocalised(Date.now())}
          </Button>
        </div>
        <div>
          {!isNarrow ? (
            Object.entries(headerTypeMap).map(([key, label]) => (
              <Button
                variant="primary"
                onClick={() => handleOverlayOpen(key)}
                key={key}
              >
                {label}
              </Button>
            ))
          ) : (
            <Button variant="primaryAlternate" onClick={show}>
              Menu
            </Button>
          )}
        </div>
      </div>
      {isShown && <NavOverlay onClose={hide} type={overlayLabel} />}
    </header>
  );
};
