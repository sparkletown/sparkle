import { useCallback, useMemo } from "react";
import {
  addDays,
  differenceInCalendarDays,
  fromUnixTime,
  isToday,
  startOfDay,
  startOfToday,
} from "date-fns";

import { ALWAYS_EMPTY_ARRAY, SPACE_TAXON, STRING_SPACE } from "settings";

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
import { range } from "utils/range";
import {
  formatDateRelativeToNow,
  formatDayLabel,
  formatTimeLocalised,
} from "utils/time";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import CN from "./ScheduleOverlay.module.scss";
const emptyPersonalizedSchedule = {};

export const ScheduleOverlay: React.FC = () => {
  const { userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? emptyPersonalizedSchedule;
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  const {
    isShown: showPersonalisedSchedule,
    toggle: togglePersonalisedSchedule,
  } = useShowHide(false);

  const {
    dayDifference,
    firstScheduleDate,
    liveAndFutureEvents,
    sovereignVenue,
  } = useVenueScheduleEvents({ userEventIds });

  const scheduledStartDate = sovereignVenue?.start_utc_seconds;

  // @debt: probably will need to be re-calculated based on minDateUtcSeconds instead of startOfDay.Check later
  const firstDayOfSchedule = useMemo(() => {
    return scheduledStartDate
      ? startOfDay(fromUnixTime(scheduledStartDate))
      : startOfToday();
  }, [scheduledStartDate]);

  const isScheduleTimeshifted = !isToday(firstDayOfSchedule);

  const weekdays = useMemo(() => {
    if (dayDifference <= 0) return ALWAYS_EMPTY_ARRAY;

    return range(dayDifference)
      .map((dayIndex) => {
        const day = addDays(firstScheduleDate, dayIndex);

        const daysEvents = liveAndFutureEvents.filter(
          isEventWithinDateAndNotFinished(day)
        );

        const eventsFilledWithPriority = daysEvents.sort(
          eventTimeAndOrderComparator
        );

        const personalisedSchedule = eventsFilledWithPriority.filter(
          (event) => event.isSaved
        );
        const formattedDay = formatDayLabel(day, isScheduleTimeshifted);

        return {
          scheduleDate: formattedDay,
          daysEvents: showPersonalisedSchedule
            ? personalisedSchedule
            : eventsFilledWithPriority,
        };
      })
      .filter((scheduleDay) => !!scheduleDay.daysEvents.length);
  }, [
    isScheduleTimeshifted,
    dayDifference,
    liveAndFutureEvents,
    firstScheduleDate,
    showPersonalisedSchedule,
  ]);

  const bookmarkEvent = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      event: ScheduledEvent
    ) => {
      if (!userWithId?.id) return;

      event.isSaved
        ? removeEventFromPersonalizedSchedule({ event, userId: userWithId.id })
        : addEventToPersonalizedSchedule({ event, userId: userWithId.id });
    },
    [userWithId?.id]
  );

  const renderedEvents = useMemo(
    () =>
      weekdays.map(({ scheduleDate, daysEvents }) => (
        <div key={scheduleDate}>
          <div>{scheduleDate}</div>
          {daysEvents.map((event) => {
            const isCurrentEventLive = isEventLive(event);
            const showDate = Boolean(
              differenceInCalendarDays(
                eventEndTime({ event }),
                eventStartTime({ event })
              )
            );

            return (
              <div key={event.id}>
                <div>{event.name}</div>
                <div>
                  <span>
                    {isCurrentEventLive
                      ? "Live "
                      : formatTimeLocalised(eventStartTime({ event })) + " - "}
                  </span>
                  <span>{isCurrentEventLive && "until "}</span>
                  <span>
                    {showDate &&
                      formatDateRelativeToNow(eventEndTime({ event }))}
                  </span>
                  {STRING_SPACE}
                  <span>{formatTimeLocalised(eventEndTime({ event }))}</span>
                  <span> in {event.spaceId}</span>
                </div>
                <div>{event.description}</div>
                <div
                  className={CN.scheduleOverlay__bookmark}
                  onClick={(e) => bookmarkEvent(e, event)}
                >
                  {event.isSaved
                    ? "Removed from bookmarked"
                    : "Bookmark this event"}
                </div>
              </div>
            );
          })}
        </div>
      )),
    [weekdays, bookmarkEvent]
  );

  return (
    <div className={CN.scheduleOverlay__wrapper}>
      <div className={CN.scheduleOverlay__header}>
        {space?.name ?? SPACE_TAXON.title} schedule
      </div>
      <button
        className={CN.scheduleOverlay__button}
        onClick={togglePersonalisedSchedule}
      >
        {showPersonalisedSchedule ? "Show all" : "Only show bookmarked events"}
      </button>
      <div className={CN.scheduleOverlay__content}>{renderedEvents}</div>
    </div>
  );
};
