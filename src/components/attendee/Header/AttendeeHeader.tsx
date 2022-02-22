import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ATTENDEE_INSIDE_URL, SPACE_TAXON } from "settings";

import { BaseVenue } from "types/venues";

import { generateUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useShowHide } from "hooks/useShowHide";

import { Button } from "../Button/Button";
import { NavOverlay } from "../NavOverlay/NavOverlay";

import CN from "./AttendeeHeader.module.scss";

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

interface AttendeeHeaderProps {
  backButtonSpace?: BaseVenue;
}

export const AttendeeHeader: React.FC<AttendeeHeaderProps> = ({
  backButtonSpace,
}) => {
  const { isShown, hide, show } = useShowHide(false);
  const [overlayLabel, setOverlayLabel] = useState("");
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);
  const history = useHistory();

  const goBack = useCallback(() => {
    if (backButtonSpace) {
      const url = generateUrl({
        route: ATTENDEE_INSIDE_URL,
        required: ["worldSlug", "spaceSlug"],
        params: {
          worldSlug,
          spaceSlug: backButtonSpace.slug,
        },
      });
      history.push(url);
    }
  }, [backButtonSpace, history, worldSlug]);

  const handleOverlayOpen = (key: string) => {
    setOverlayLabel(key);
    show();
  };

  return (
    <header className={CN.attendeeHeader}>
      <div className={CN.attendeeHeaderContainer}>
        <div>
          {backButtonSpace ? (
            <Button onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} /> Leave
            </Button>
          ) : (
            <Button>{space?.name ?? `This ${SPACE_TAXON.title}`}</Button>
          )}
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
