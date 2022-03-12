import React, { useCallback, useMemo } from "react";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addDays, differenceInCalendarDays } from "date-fns";

import { ALWAYS_EMPTY_OBJECT, STRING_DASH_SPACE, STRING_SPACE } from "settings";

import {
  addEventToPersonalizedSchedule,
  removeEventFromPersonalizedSchedule,
} from "api/profile";

import { ScheduledEvent } from "types/venues";

import {
  eventEndTime,
  eventStartTime,
  eventTimeAndOrderComparator,
  isEventLive,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import CN from "./ScheduleOverlay.module.scss";

interface ScheduleDay {
  daysEvents: ScheduledEvent[];
  scheduleDate: Date;
}

type ScheduleEventsProps = {
  showPersonalisedSchedule: boolean;
  selectedDayIndex: number;
};

export const ScheduleEvents: React.FC<ScheduleEventsProps> = ({
  showPersonalisedSchedule,
  selectedDayIndex,
}) => {
  const { space } = useWorldAndSpaceByParams();
  const { userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? ALWAYS_EMPTY_OBJECT;

  const { firstScheduleDate, liveAndFutureEvents } = useVenueScheduleEvents({
    userEventIds,
  });

  const bookmarkEvent = useCallback(
    (event) => {
      if (!userWithId?.id || !event.id) return;

      event.isSaved
        ? removeEventFromPersonalizedSchedule({ event, userId: userWithId?.id })
        : addEventToPersonalizedSchedule({ event, userId: userWithId?.id });
    },
    [userWithId?.id]
  );

  const schedule: ScheduleDay = useMemo(() => {
    const day = addDays(firstScheduleDate, selectedDayIndex);

    const daysEvents = liveAndFutureEvents.filter(
      isEventWithinDateAndNotFinished(day)
    );

    const eventsFilledWithPriority = daysEvents.sort(
      eventTimeAndOrderComparator
    );

    const currentVenueBookMarkEvents = eventsFilledWithPriority.filter(
      ({ isSaved, spaceId: eventSpaceId }) =>
        isSaved && eventSpaceId?.toLowerCase() === space?.id.toLowerCase()
    );

    const currentVenueEvents = eventsFilledWithPriority.filter(
      ({ spaceId: eventSpaceId }) =>
        eventSpaceId?.toLowerCase() === space?.id.toLowerCase()
    );

    return {
      scheduleDate: day,
      daysEvents: showPersonalisedSchedule
        ? currentVenueBookMarkEvents
        : currentVenueEvents,
    };
  }, [
    firstScheduleDate,
    selectedDayIndex,
    liveAndFutureEvents,
    showPersonalisedSchedule,
    space,
  ]);

  const renderedEvents = useMemo(
    () =>
      schedule.daysEvents.map((event) => {
        const isCurrentEventLive = isEventLive(event);

        const showDate = Boolean(
          differenceInCalendarDays(
            eventEndTime({ event }),
            eventStartTime({ event })
          )
        );

        return (
          <div key={event.id} className={CN.eventContainer}>
            <div className={CN.eventWrapper}>
              <div className={CN.eventTitle}>
                <span>{event.name}</span>
                <FontAwesomeIcon
                  icon={event.isSaved ? solidBookmark : regularBookmark}
                  onClick={() => bookmarkEvent(event)}
                  className={CN.bookmarkIcon}
                />
              </div>
              <div>
                <span>
                  {formatTimeLocalised(eventStartTime({ event })) +
                    STRING_DASH_SPACE}
                </span>
                <span>
                  {showDate && formatDateRelativeToNow(eventEndTime({ event }))}
                </span>
                {STRING_SPACE}
                <span>{formatTimeLocalised(eventEndTime({ event }))}</span>
                <span> in {event.spaceId}</span>
              </div>
              <div>{event.description}</div>
            </div>
            <div className={CN.liveEvent}>{isCurrentEventLive && "NOW"}</div>
          </div>
        );
      }),
    [schedule.daysEvents, bookmarkEvent]
  );

  return (
    <div className={CN.scheduleOverlayContent}>
      <div className={CN.contentWrapper}>{renderedEvents}</div>
    </div>
  );
};
