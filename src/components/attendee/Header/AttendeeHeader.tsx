import { useState } from "react";

import { SPACE_TAXON } from "settings";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useShowHide } from "hooks/useShowHide";

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
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  const handleOverlayOpen = (key: string) => {
    setOverlayLabel(key);
    show();
  };

  return (
    <header className={styles.AttendeeHeader}>
      <div className={styles.AttendeeHeader__container}>
        <div>
          <Button variant="primary">
            {space?.name ?? `This ${SPACE_TAXON.title}`}
          </Button>
        </div>
        <div>
          {Object.entries(headerTypeMap).map(([key, label]) => (
            <Button
              variant="primary"
              onClick={() => handleOverlayOpen(key)}
              key={key}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      {isShown && <NavOverlay onClose={hide} type={overlayLabel} />}
    </header>
  );
};
