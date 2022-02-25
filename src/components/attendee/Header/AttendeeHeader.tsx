import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ATTENDEE_INSIDE_URL, SPACE_TAXON } from "settings";

import { UserWithId } from "types/id";
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

interface AttendeeHeaderProps {
  backButtonSpace?: BaseVenue;
}

export const AttendeeHeader: React.FC<AttendeeHeaderProps> = ({
  backButtonSpace,
}) => {
  const { isShown: isScheduleShown, hide, show } = useShowHide(false);
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

  const { isExpanded: isChatExpanded } = useChatSidebarControls();

  const headerClassnames = classNames(CN.attendeeHeader, {
    [CN.chatExpanded]: isChatExpanded,
  });

  // MOCK DATA

  const { userWithId } = useUser();

  if (!userWithId) return null;

  const mockData: UserWithId[] = Array(30).fill(userWithId);

  console.log(userWithId, mockData);

  return (
    <header className={headerClassnames}>
      <div className={CN.container}>
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
          <Button onClick={show}>Schedule</Button>
          <Button>Profile</Button>
          <Button>Search</Button>
        </div>
      </div>
      <NavOverlay isShown={isScheduleShown} onClose={hide} type="Schedule" />
    </header>
  );
};
