import { Link } from "react-router-dom";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { differenceInCalendarDays } from "date-fns";

import { ATTENDEE_INSIDE_URL, STRING_DASH_SPACE, STRING_SPACE } from "settings";

import { ScheduledEvent } from "types/venues";

import { eventEndTime, eventStartTime, isEventLive } from "utils/event";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";
import { generateUrl } from "utils/url";

import { useSpaceById } from "hooks/spaces/useSpaceById";
import { useWorldById } from "hooks/worlds/useWorldById";

import CN from "./ScheduleOverlay.module.scss";

type ScheduleEventProps = {
  event: ScheduledEvent;
  bookmarkEvent: (event: ScheduledEvent) => void;
};

export const ScheduleEvent: React.FC<ScheduleEventProps> = ({
  event,
  bookmarkEvent,
}) => {
  const isCurrentEventLive = isEventLive(event);
  const { world } = useWorldById(event);
  const { space } = useSpaceById(event);

  const showDate = Boolean(
    differenceInCalendarDays(eventEndTime({ event }), eventStartTime({ event }))
  );

  const visitSpaceUrl = generateUrl({
    route: ATTENDEE_INSIDE_URL,
    required: ["worldSlug", "spaceSlug"],
    params: { worldSlug: world?.slug, spaceSlug: space?.slug },
  });

  return (
    <div key={event.id} className={CN.eventContainer}>
      <div className={CN.eventWrapper}>
        <div className={CN.eventTitle}>
          <Link to={visitSpaceUrl} className={CN.eventName}>
            {event.name}
          </Link>
          <FontAwesomeIcon
            icon={event.isSaved ? solidBookmark : regularBookmark}
            onClick={() => bookmarkEvent(event)}
            className={CN.bookmarkIcon}
          />
        </div>
        <div>
          <span>
            {formatTimeLocalised(eventStartTime({ event })) + STRING_DASH_SPACE}
          </span>
          <span>
            {showDate && formatDateRelativeToNow(eventEndTime({ event }))}
          </span>
          {STRING_SPACE}
          <span>{formatTimeLocalised(eventEndTime({ event }))}</span>
          <span> in {space?.name}</span>
        </div>
        <div>{event.description}</div>
      </div>
      <div className={CN.liveEvent}>{isCurrentEventLive && "NOW"}</div>
    </div>
  );
};
