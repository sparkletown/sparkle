import React, {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useIntersection } from "react-use";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleLeft as angleLeft,
  faAngleRight as angleRight,
  faBookmark as solidBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { IntersectingButton } from "components/attendee/IntersectingButton";
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
  STRING_DASH_SPACE,
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
const weekDayStepValue = 7;
const weekDayStepSkipValue = weekDayStepValue * 2;
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

  const allRefs = useRef<RefObject<HTMLButtonElement>[]>(
    range(dayDifference).map(() => React.createRef())
  );
  const firstDayIntersect = useIntersection(allRefs?.current[0], {
    rootMargin: "0px",
  });
  const lastDayIntersect = useIntersection(
    allRefs?.current[dayDifference - 1],
    {
      rootMargin: "0px",
    }
  );

  const [forwardTarget, setForwardTarget] = useState<
    RefObject<HTMLButtonElement>
  >(allRefs?.current[weekDayStepValue]);
  const [backwardTarget, setBackwardTarget] = useState<
    RefObject<HTMLButtonElement>
  >(allRefs?.current[0]);

  // triggered on schedule days scroll, sets prev arrow value to {currentIntersectingDay - 14}
  // or the first day and next arrow value to {currentIntersectingDay + 7} or the last day
  const updateIntersected = (lastIntersected: RefObject<HTMLButtonElement>) => {
    const newIndex = allRefs.current.findIndex(
      (el) => el.current?.innerText === lastIntersected.current?.innerText
    );
    const newTarget =
      allRefs.current[newIndex - 1] ??
      allRefs.current[allRefs.current.length - 1];
    const newBackwardTarget =
      allRefs.current[newIndex - weekDayStepSkipValue] ?? allRefs.current[0];
    setForwardTarget(newTarget);
    setBackwardTarget(newBackwardTarget);
  };

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

      return (
        <IntersectingButton
          key={day.toISOString()}
          disabled={!daysWithEvents}
          onClick={() => {
            setSelectedDayIndex(dayIndex);
          }}
          variant="alternative"
          className={buttonClasses}
          forwardRef={allRefs.current[i]}
          updateIntersected={updateIntersected}
        >
          {formattedDay}
        </IntersectingButton>
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
  const handleWeekScrollForward = () => {
    const scrollRef =
      forwardTarget?.current ?? allRefs?.current[weekDayStepValue].current;
    scrollRef?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    recalculateSkipPrevValues(scrollRef);
  };

  // triggered on arrow click, sets prev arrow value to {currentIntersectingDay - 14} or the first day
  // and next arrow value to {currentIntersectingDay + 7} or the last day
  const recalculateSkipPrevValues = (scrollRef: HTMLButtonElement | null) => {
    const newIndex =
      allRefs.current.findIndex(
        (el) => el.current?.innerText === scrollRef?.innerText
      ) + weekDayStepValue;
    const newTarget =
      allRefs.current[newIndex] ?? allRefs.current[allRefs.current.length - 1];
    const newBackwardTarget =
      allRefs.current[newIndex - weekDayStepSkipValue] ?? allRefs.current[0];
    setForwardTarget(newTarget);
    setBackwardTarget(newBackwardTarget);
  };

  const handleWeekScrollBackward = () => {
    const scrollRef = backwardTarget?.current ?? allRefs?.current[0].current;
    scrollRef?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });

    recalculateSkipToValues(scrollRef);
  };

  // triggered on arrow click, sets prev arrow value to {currentIntersectingDay - 7} or the first day
  // and next arrow value to {currentIntersectingDay + 14} or the last day
  const recalculateSkipToValues = (scrollRef: HTMLButtonElement | null) => {
    const newIndex =
      allRefs.current.findIndex(
        (el) => el.current?.innerText === scrollRef?.innerText
      ) - weekDayStepValue;
    const newTarget = allRefs.current[newIndex] ?? allRefs.current[0];
    const newForwardTarget =
      allRefs.current[newIndex + weekDayStepSkipValue] ??
      allRefs.current[weekDayStepValue];
    setForwardTarget(newForwardTarget);
    setBackwardTarget(newTarget);
  };

  const backAngleClasses = classNames(CN.angleIcon, {
    [CN.angleDisabled]: firstDayIntersect?.isIntersecting,
  });

  const forwardAngleClassnames = classNames(CN.angleIcon, {
    [CN.angleDisabled]: lastDayIntersect?.isIntersecting,
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
