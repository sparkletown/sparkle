import { useCallback } from "react";
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
    [CN.attendeeHeader__chatExpanded]: isChatExpanded,
  });

  return (
    <header className={headerClassnames}>
      <div className={CN.attendeeHeader__container}>
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
          <Button onClick={show}>Schedule</Button>
          <Button>Profile</Button>
          <Button>Search</Button>
        </div>
      </div>
      <NavOverlay isShown={isScheduleShown} onClose={hide} type="Schedule" />
    </header>
  );
};
