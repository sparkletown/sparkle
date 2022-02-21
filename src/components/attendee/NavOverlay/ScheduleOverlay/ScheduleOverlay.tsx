import React, { useCallback, useMemo, useState } from "react";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { Button } from "components/attendee/Button";
import {
  addDays,
  differenceInCalendarDays,
  format,
  fromUnixTime,
  isToday,
  startOfDay,
  startOfToday,
} from "date-fns";

import { ALWAYS_EMPTY_ARRAY, ALWAYS_EMPTY_OBJECT } from "settings";

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
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { Loading } from "components/molecules/Loading";

import { Toggler } from "components/atoms/Toggler";

import CN from "./ScheduleOverlay.module.scss";

interface ScheduleDay {
  daysEvents: ScheduledEvent[];
  scheduleDate: Date;
}

export const ScheduleOverlay: React.FC = () => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);
  const { userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? ALWAYS_EMPTY_OBJECT;

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const {
    isShown: showPersonalisedSchedule,
    toggle: togglePersonalisedSchedule,
  } = useShowHide(false);

  const {
    dayDifference,
    firstScheduleDate,
    liveAndFutureEvents,
    isEventsLoading,
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
    const formatDayLabel = (day: Date | number) => {
      if (isScheduleTimeshifted) {
        return format(day, "do");
      } else {
        return formatDateRelativeToNow(day, {
          formatOtherDate: (dateOrTimestamp) => format(dateOrTimestamp, "do"),
          formatTomorrow: (dateOrTimestamp) => format(dateOrTimestamp, "do"),
        });
      }
    };

    if (dayDifference <= 0) return ALWAYS_EMPTY_ARRAY;

    return range(dayDifference).map((dayIndex) => {
      const day = addDays(firstScheduleDate, dayIndex);

      const daysWithEvents = liveAndFutureEvents.some(
        isEventWithinDateAndNotFinished(day)
      );

      const formattedDay = formatDayLabel(day);

      const buttonClasses = classNames(CN.scheduleButton, {
        [CN.scheduleButtonActive]: dayIndex === selectedDayIndex,
        [CN.scheduleButtonDisabled]: !daysWithEvents,
      });

      return (
        <Button
          key={day.toISOString()}
          disabled={!daysWithEvents}
          onClick={() => {
            setSelectedDayIndex(dayIndex);
          }}
          variant="alternative"
          className={buttonClasses}
        >
          {formattedDay}
        </Button>
      );
    });
  }, [
    isScheduleTimeshifted,
    dayDifference,
    liveAndFutureEvents,
    firstScheduleDate,
    selectedDayIndex,
  ]);

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
        isSaved && eventSpaceId?.toLowerCase() === space?.id
    );

    const currentVenueEvents = eventsFilledWithPriority.filter(
      ({ spaceId: eventSpaceId }) => eventSpaceId?.toLowerCase() === space?.id
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
          <div key={event.id} className={CN.eventWrapper}>
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
                {isCurrentEventLive
                  ? "Live "
                  : formatTimeLocalised(eventStartTime({ event })) + " - "}
              </span>
              <span>{isCurrentEventLive && "until "}</span>
              <span>
                {showDate && formatDateRelativeToNow(eventEndTime({ event }))}
              </span>{" "}
              <span>{formatTimeLocalised(eventEndTime({ event }))}</span>
              <span> in {event.spaceId}</span>
            </div>
            <div>{event.description}</div>
          </div>
        );
      }),
    [schedule.daysEvents, bookmarkEvent]
  );

  return (
    <div className={CN.scheduleOverlayWrapper}>
      <div className={CN.scheduleOverlayHeader}>
        {space?.name || "Space"} schedule
      </div>
      <Toggler
        containerClassName={CN.scheduleOverlayButton}
        name="bookmarked-toggle"
        toggled={showPersonalisedSchedule}
        onChange={togglePersonalisedSchedule}
        label="Only show bookmarked events"
      />
      <div className={CN.scheduleDays}>{weekdays}</div>
      {isEventsLoading && (
        <Loading
          containerClassName="Schedule__loading"
          label="Events are loading"
        />
      )}
      <div className={CN.scheduleOverlayContent}>{renderedEvents}</div>
    </div>
  );
};
