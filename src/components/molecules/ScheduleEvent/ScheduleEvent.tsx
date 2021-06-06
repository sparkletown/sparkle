import React, { MouseEventHandler, useCallback } from "react";
import classNames from "classnames";
import { useCss } from "react-use";

import { SCHEDULE_HOUR_COLUMN_WIDTH_PX } from "settings";

import {
  addEventToPersonalizedSchedule,
  removeEventFromPersonalizedSchedule,
} from "api/profile";

import { PersonalizedVenueEvent } from "types/venues";

import { isEventLive } from "utils/event";
import { ONE_HOUR_IN_MINUTES } from "utils/time";

import { useUser } from "hooks/useUser";
import { useShowHide } from "hooks/useShowHide";

import { EventModal } from "components/organisms/EventModal";
import { calcStartPosition } from "components/molecules/Schedule/utils";
import { Bookmark } from "components/atoms/Bookmark";

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

  const eventMarginLeftPx = calcStartPosition(
    event.start_utc_seconds,
    scheduleStartHour
  );

  const containerCssVars = useCss({
    "--event--margin-left": `${eventMarginLeftPx}px`,
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

  const {
    isShown: isEventModalVisible,
    show: showEventModal,
    hide: hideEventModal,
  } = useShowHide();

  return (
    <>
      <div className={containerClasses}>
        <div onClick={showEventModal}>
          <div className="ScheduleEvent__info">
            <div className="ScheduleEvent__title">{event.name}</div>
            <div className="ScheduleEvent__host">by {event.host}</div>
          </div>
        </div>
        <Bookmark
          className="ScheduleEvent__bookmark"
          onClick={bookmarkEvent}
          isSaved={event.isSaved}
        />
      </div>

      <EventModal
        show={isEventModalVisible}
        onHide={hideEventModal}
        event={event}
      />
    </>
  );
};
