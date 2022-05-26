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
import { useLiveUser } from "hooks/user/useLiveUser";
import { useShowHide } from "hooks/useShowHide";
import { useMediaQuery } from "hooks/viewport/useMediaQuery";

import sparkleLogoImage from "assets/images/sparkle-header.png";

import CN from "./AttendeeHeader.module.scss";

type HeaderTab = "schedule" | "search" | "profile";

const tabCaptions: Readonly<Record<HeaderTab, String>> = {
  schedule: "Schedule",
  search: "Search",
  profile: "Profile",
};

interface AttendeeHeaderProps {
  backButtonSpace?: BaseVenue;
  isBannerOn?: boolean;
  hasLogo?: boolean;
}

export const AttendeeHeader: React.FC<AttendeeHeaderProps> = ({
  backButtonSpace,
  isBannerOn,
  hasLogo,
}) => {
  const { isShown, hide, show } = useShowHide(false);
  const [overlayLabel, setOverlayLabel] = useState("");
  const { isTablet, isMobile, isLaptopSmall } = useMediaQuery();
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

  const { userWithId } = useLiveUser();

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

  const { isExpanded: isChatExpanded } = useChatSidebarControls();

  const headerClassnames = classNames(CN.attendeeHeader, {
    [CN.headerNarrow]: isChatExpanded,
    [CN.blur]: isBannerOn,
  });

  if (!userWithId) return null;

  const containerClasses = classNames(CN.container, {
    [CN.narrow]: isNarrow,
    [CN.blur]: isBannerOn,
  });
  console.log(backButtonSpace);
  return (
    <>
      <header className={headerClassnames}>
        <div className={containerClasses}>
          {hasLogo ? (
            <img
              src={sparkleLogoImage}
              alt="sparkle-logo"
              className={CN.logoImage}
            />
          ) : (
            <>
              {backButtonSpace ? (
                <Button
                  onClick={goBack}
                  variant="primary"
                  transparent={isNarrow}
                >
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
                  <div className={CN.headerTitle}>
                    {space?.name ?? `This ${SPACE_TAXON.title}`}
                  </div>
                  <span className={CN.headerTimeTransparent}>
                    {getDateHoursAndMinutes(currentMilliseconds())}
                  </span>
                </Button>
              )}
              {!isLaptopSmall && space && <Attendance space={space} />}
            </>
          )}

          <div className={CN.captionWrapper}>{renderedCaptions}</div>
        </div>
      </header>
      {isShown && (
        <NavOverlay
          onClose={hide}
          type={overlayLabel}
          isBannerOn={isBannerOn}
        />
      )}
    </>
  );
};
