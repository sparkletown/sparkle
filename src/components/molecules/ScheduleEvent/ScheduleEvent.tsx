import React, { MouseEventHandler, useCallback, useState } from "react";
import classNames from "classnames";
import { useCss } from "react-use";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

import { SCHEDULE_HOUR_COLUMN_WIDTH_PX } from "settings";

import {
  addEventToPersonalizedSchedule,
  removeEventFromPersonalizedSchedule,
} from "api/profile";

import { PersonalizedVenueEvent } from "types/venues";

import { isEventLive } from "utils/event";
import { ONE_HOUR_IN_MINUTES } from "utils/time";

import { useUser } from "hooks/useUser";

import { calcStartPosition } from "components/molecules/Schedule/utils";
import { EventModal } from "components/organisms/EventModal";

import "./ScheduleEvent.scss";

export interface ScheduleEventProps {
  event: PersonalizedVenueEvent;
  scheduleStartHour: number;
  personalizedEvent?: boolean;
}

export const ScheduleEvent: React.FC<ScheduleEventProps> = ({
  event,
  scheduleStartHour,
  personalizedEvent: isPersonalizedEvent = false,
}) => {
  const { userId } = useUser();

  // @debt ONE_HOUR_IN_MINUTES is deprectated; refactor to use utils/time or date-fns functions
  const eventWidthPx =
    (event.duration_minutes * SCHEDULE_HOUR_COLUMN_WIDTH_PX) /
    ONE_HOUR_IN_MINUTES;

  const containerCssVars = useCss({
    "--event--margin-left": `${calcStartPosition(
      event.start_utc_seconds,
      scheduleStartHour
    )}px`,
    "--event--width": `${eventWidthPx}px`,
  });

  const containerClasses = classNames(
    "ScheduleEvent",
    {
      "ScheduleEvent--live": isEventLive(event),
      "ScheduleEvent--users": isPersonalizedEvent,
    },
    containerCssVars
  );

  const bookmarkEvent: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    if (!userId || !event.id) return;

    event.isSaved
      ? removeEventFromPersonalizedSchedule({ event, userId })
      : addEventToPersonalizedSchedule({ event, userId });
  }, [userId, event]);

  const [showEventModal, setShowEventModal] = useState(false);

  return (
    <>
      <div className={containerClasses} onClick={() => setShowEventModal(true)}>
        <div className="ScheduleEvent__info">
          <div className="ScheduleEvent__title">{event.name}</div>
          <div className="ScheduleEvent__host">by {event.host}</div>
        </div>

        <div className="ScheduleEvent__bookmark" onClick={bookmarkEvent}>
          <FontAwesomeIcon
            icon={event.isSaved ? solidBookmark : regularBookmark}
          />
        </div>
      </div>

      <EventModal
        show={showEventModal}
        onHide={() => setShowEventModal(false)}
        event={event}
      />
    </>
  );
};
