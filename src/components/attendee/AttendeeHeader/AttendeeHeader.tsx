import { useState } from "react";

import { SPACE_TAXON } from "settings";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useShowHide } from "hooks/useShowHide";

import { Button } from "../Button";
import { NavOverlay } from "../NavOverlay/NavOverlay";

import CN from "./AttendeeHeader.module.scss";

type HeaderTab = "schedule" | "search" | "profile";

const tabCaptions: Readonly<Record<HeaderTab, String>> = {
  schedule: "Schedule",
  search: "Search",
  profile: "Profile",
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
    <header className={CN.attendeeHeader}>
      <div className={CN.attendeeHeaderContainer}>
        <div>
          <Button>{space?.name ?? `This ${SPACE_TAXON.title}`}</Button>
        </div>
        <div>
          {Object.entries(tabCaptions).map(([key, label]) => (
            <Button onClick={() => handleOverlayOpen(key)} key={key}>
              {label}
            </Button>
          ))}
        </div>
      </div>
      {isShown && <NavOverlay onClose={hide} type={overlayLabel} />}
    </header>
  );
};
