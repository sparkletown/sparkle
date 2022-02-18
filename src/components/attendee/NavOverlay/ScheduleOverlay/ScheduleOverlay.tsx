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
    isShown: showBookmarkedEvents,
    toggle: togglebookmarkedEvents,
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
        const eventDay = addDays(firstScheduleDate, dayIndex);

        const daysWithEvents = liveAndFutureEvents.filter(
          isEventWithinDateAndNotFinished(eventDay)
        );

        const prioritizedEvents = daysWithEvents.sort(
          eventTimeAndOrderComparator
        );

        const bookmarkedEvents = prioritizedEvents.filter(
          (event) => event.isSaved
        );
        const formattedDay = formatDayLabel(eventDay, isScheduleTimeshifted);

        return {
          scheduleDate: formattedDay,
          daysWithEvents: showBookmarkedEvents
            ? bookmarkedEvents
            : prioritizedEvents,
        };
      })
      .filter((scheduleDay) => !!scheduleDay.daysWithEvents.length);
  }, [
    isScheduleTimeshifted,
    dayDifference,
    liveAndFutureEvents,
    firstScheduleDate,
    showBookmarkedEvents,
  ]);

  const handleEventBookmark = useCallback(
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
      weekdays.map(({ scheduleDate, daysWithEvents }) => (
        <div key={scheduleDate}>
          <div>{scheduleDate}</div>
          {daysWithEvents.map((event) => {
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
                  className={CN.scheduleOverlayBookmark}
                  onClick={(e) => handleEventBookmark(e, event)}
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
    [weekdays, handleEventBookmark]
  );

  return (
    <div className={CN.scheduleOverlayWrapper}>
      <div className={CN.scheduleOverlayHeader}>
        {space?.name || SPACE_TAXON.title} schedule
      </div>
      <button
        className={CN.scheduleOverlayButton}
        onClick={togglebookmarkedEvents}
      >
        {showBookmarkedEvents ? "Show all" : "Only show bookmarked events"}
      </button>
      <div className={CN.scheduleOverlayContent}>{renderedEvents}</div>
    </div>
  );
};
