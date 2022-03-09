import React, { useCallback, useMemo, useRef, useState } from "react";
import { useIntersection } from "react-use";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleLeft as angleLeft,
  faAngleRight as angleRight,
  faBookmark as solidBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { Button } from "components/attendee/Button";
import { Toggler } from "components/attendee/Toggler";
import {
  addDays,
  differenceInCalendarDays,
  fromUnixTime,
  isToday,
  startOfDay,
  startOfToday,
} from "date-fns";

import {
  ALWAYS_EMPTY_ARRAY,
  ALWAYS_EMPTY_OBJECT,
  STRING_SPACE,
} from "settings";

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

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { Loading } from "components/molecules/Loading";

import CN from "./ScheduleOverlay.module.scss";

const minWeekDaysScrollValue = 8;
interface ScheduleDay {
  daysEvents: ScheduledEvent[];
  scheduleDate: Date;
}

export const ScheduleOverlay: React.FC = () => {
  const { space } = useWorldAndSpaceByParams();
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
  const firstRef = useRef<HTMLButtonElement>(null);
  const lastRef = useRef<HTMLButtonElement>(null);
  const firstDayRef = useIntersection(firstRef, { rootMargin: "0px" });
  const lastDayRef = useIntersection(lastRef, { rootMargin: "0px" });

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

    return range(dayDifference).map((dayIndex, i) => {
      const day = addDays(firstScheduleDate, dayIndex);

      const daysWithEvents = liveAndFutureEvents.some(
        isEventWithinDateAndNotFinished(day)
      );

      const formattedDay = formatDayLabel(day, isScheduleTimeshifted);

      const buttonClasses = classNames(CN.scheduleButton, {
        [CN.scheduleButtonActive]: dayIndex === selectedDayIndex,
        [CN.scheduleButtonDisabled]: !daysWithEvents,
      });

      // const handleAddRef = (el: unknown) => {
      //   const element = el as RefObject<HTMLButtonElement>;
      //   if(!dayIndex) {
      //   firstRef.current[i] = element;
      // }

      // if(dayIndex % 8 === 0 && !!dayIndex) {
      //   lastRef.current[i] = element;
      // }
      // }

      let buttonRef;

      if (!dayIndex) {
        // firstRef.current[i] = buttonRef;
        // buttonRef = firstRef.current[i];
        buttonRef = firstRef;
      }

      if (dayIndex % 8 === 0 && !!dayIndex) {
        // lastRef.current[i] = buttonRef
        // console.log(lastRef.current[i], buttonRef)
        buttonRef = lastRef;
      }

      return (
        <Button
          key={day.toISOString()}
          disabled={!daysWithEvents}
          onClick={() => {
            setSelectedDayIndex(dayIndex);
          }}
          variant="alternative"
          className={buttonClasses}
          forwardRef={buttonRef}
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
                  {formatTimeLocalised(eventStartTime({ event })) + " - "}
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
  const handleWeekScrollForward = () => {
    // const scrolToElement = lastRef?.current;
    // console.log(scrolToElement)
    // console.log(lastRef)
    // const [, firstCurrent] = lastRef?.current?.filter(x => !!x) ?? [];
    // console.log(firstCurrent, firstCurrent?.current)
    lastRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const handleWeekScrollBackward = () => {
    // const scrolToElement = firstRef?.current;
    // console.log(scrolToElement)
    // console.log(firstRef)
    // weekdays.findIndex(firstRef?.current?.value)
    // const [firstCurrent] = firstRef?.current?.filter(x => !!x) ?? [];
    // console.log(firstCurrent)
    firstRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const backAngleClasses = classNames(CN.angleIcon, {
    [CN.angleDisabled]: firstDayRef?.isIntersecting,
  });

  const forwardAngleClassnames = classNames(CN.angleIcon, {
    [CN.angleDisabled]: lastDayRef?.isIntersecting,
  });

  return (
    <div className={CN.scheduleOverlayWrapper}>
      <div className={CN.scheduleOverlayHeader}>
        {space?.name || "Space"} schedule
      </div>
      <Toggler
        containerClassName={CN.scheduleOverlayButton}
        toggled={showPersonalisedSchedule}
        onChange={togglePersonalisedSchedule}
        title="Only show bookmarked events"
      />
      <div className={CN.scheduleDaysWrapper}>
        <div className={CN.scheduleDays}>{weekdays}</div>
        {weekdays.length > minWeekDaysScrollValue && (
          <div className={CN.scheduleDaysArrows}>
            <FontAwesomeIcon
              icon={angleLeft}
              className={backAngleClasses}
              onClick={handleWeekScrollBackward}
            />
            <FontAwesomeIcon
              icon={angleRight}
              className={forwardAngleClassnames}
              onClick={handleWeekScrollForward}
            />
          </div>
        )}
      </div>
      {isEventsLoading && (
        <Loading
          containerClassName="Schedule__loading"
          label="Events are loading"
        />
      )}
      <div className={CN.scheduleOverlayContent}>
        <div className={CN.contentWrapper}>{renderedEvents}</div>
      </div>
    </div>
  );
};
