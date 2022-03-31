import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { Attendance } from "components/attendee/Attendance";
import { Button } from "components/attendee/Button";
import { NavOverlay } from "components/attendee/NavOverlay";

import { ATTENDEE_INSIDE_URL, SPACE_TAXON } from "settings";

import { BaseVenue } from "types/venues";

import { currentMilliseconds, getDateHoursAndMinutes } from "utils/time";
import { generateUrl } from "utils/url";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import { useMediaQuery } from "hooks/viewport/useMediaQuery";

import CN from "./AttendeeHeader.module.scss";

type HeaderTab = "schedule" | "search" | "profile";

const tabCaptions: Readonly<Record<HeaderTab, String>> = {
  schedule: "Schedule",
  search: "Search",
  profile: "Profile",
};

interface AttendeeHeaderProps {
  backButtonSpace?: BaseVenue;
}

export const AttendeeHeader: React.FC<AttendeeHeaderProps> = ({
  backButtonSpace,
}) => {
  const { isShown, hide, show } = useShowHide(false);
  const [overlayLabel, setOverlayLabel] = useState("");
  const { isTablet, isMobile } = useMediaQuery();
  const { space, worldSlug } = useWorldAndSpaceByParams();
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

  const handleOverlayOpen = useCallback(
    (key: string) => {
      setOverlayLabel(key);
      show();
    },
    [show]
  );

  const { isExpanded: isChatExpanded } = useChatSidebarControls();

  const headerClassnames = classNames(CN.attendeeHeader, {
    [CN.chatExpanded]: isChatExpanded,
  });

  const { userWithId } = useUser();

  const isNarrow = isTablet || isMobile;

  const renderedCaptions = useMemo(
    () =>
      !isNarrow ? (
        Object.entries(tabCaptions).map(([key, label]) => (
          <Button
            variant="primary"
            onClick={() => handleOverlayOpen(key)}
            key={key}
          >
            {label}
          </Button>
        ))
      ) : (
        <Button variant="primary" transparent onClick={show}>
          Menu
        </Button>
      ),
    [handleOverlayOpen, show, isNarrow]
  );

  if (!userWithId) return null;

  const containerClasses = classNames(CN.container, {
    [CN.narrow]: isNarrow,
  });

  return (
    <header className={headerClassnames}>
      <div className={containerClasses}>
        {backButtonSpace ? (
          <Button onClick={goBack} variant="primary" transparent={isNarrow}>
            <FontAwesomeIcon icon={faArrowLeft} /> Leave
            <span className={CN.headerTimeTransparent}>
              {getDateHoursAndMinutes(currentMilliseconds())}
            </span>
          </Button>
        ) : (
          <Button
            variant="primary"
            transparent={isNarrow}
            onClick={() => handleOverlayOpen(space?.name || "")}
          >
            {space?.name ?? `This ${SPACE_TAXON.title}`}
            <span className={CN.headerTime}>
              {getDateHoursAndMinutes(currentMilliseconds())}
            </span>
          </Button>
        )}
        {!isNarrow && (
          <Attendance
            totalUsersCount={space?.recentUserCount}
            usersSample={space?.recentUsersSample}
          />
        )}
        <div>{renderedCaptions}</div>
      </div>
      {isShown && <NavOverlay onClose={hide} type={overlayLabel} />}
    </header>
  );
};
