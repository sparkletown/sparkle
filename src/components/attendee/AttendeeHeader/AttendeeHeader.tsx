import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ATTENDEE_INSIDE_URL, SPACE_TAXON } from "settings";

import { BaseVenue } from "types/venues";

import { generateUrl } from "utils/url";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { Attendance } from "../Attendance";
import { Button } from "../Button";
import { NavOverlay } from "../NavOverlay/NavOverlay";

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

  const handleOverlayOpen = (key: string) => {
    setOverlayLabel(key);
    show();
  };

  const { isExpanded: isChatExpanded } = useChatSidebarControls();

  const headerClassnames = classNames(CN.attendeeHeader, {
    [CN.chatExpanded]: isChatExpanded,
  });

  const { userWithId } = useUser();

  if (!userWithId) return null;

  // MOCK DATA
  // const mockData: UserWithId[] = Array(30).fill(userWithId);

  return (
    <header className={headerClassnames}>
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
        <Attendance
          totalUsersCount={space?.recentUserCount}
          usersSample={space?.recentUsersSample}
        />
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
