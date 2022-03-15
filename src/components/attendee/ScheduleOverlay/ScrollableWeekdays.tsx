import React, { RefObject, useCallback, useRef, useState } from "react";
import { useIntersection } from "react-use";
import {
  faAngleLeft as angleLeft,
  faAngleRight as angleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { range } from "lodash";

import { ALWAYS_EMPTY_OBJECT } from "settings";

import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { ScheduleDay } from "./ScheduleDay";
import { WeekDaysProps } from "./Weekdays";

import CN from "./ScheduleOverlay.module.scss";

const weekDayStepValue = 7;
const weekDayStepSkipValue = weekDayStepValue * 2;

interface ScrollableWeekDaysProps extends WeekDaysProps {
  dayDifference: number;
}

export const ScrollableWeekdays: React.FC<ScrollableWeekDaysProps> = ({
  onIndexSelect,
  selectedDayIndex,
  dayDifference,
  isScheduleTimeshifted,
}) => {
  const { userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? ALWAYS_EMPTY_OBJECT;

  const { firstScheduleDate, liveAndFutureEvents } = useVenueScheduleEvents({
    userEventIds,
  });

  const allRefs = useRef<RefObject<HTMLButtonElement>[]>(
    range(dayDifference).map(() => React.createRef())
  );
  const firstDayIntersect = useIntersection(allRefs?.current?.[0], {
    rootMargin: "0px",
  });
  const lastDayIntersect = useIntersection(
    allRefs?.current?.[dayDifference - 1],
    {
      rootMargin: "0px",
    }
  );

  const [forwardTarget, setForwardTarget] = useState<
    RefObject<HTMLButtonElement>
  >(allRefs?.current?.[weekDayStepValue] ?? null);
  const [backwardTarget, setBackwardTarget] = useState<
    RefObject<HTMLButtonElement>
  >(allRefs?.current?.[0] ?? null);

  // triggered on schedule days scroll, sets prev arrow value to {currentIntersectingDay - 14}
  // or the first day and next arrow value to {currentIntersectingDay + 7} or the last day
  const updateIntersected = useCallback(
    (lastIntersected: RefObject<HTMLButtonElement>) => {
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
    },
    []
  );

  // TODO: Unite logic along with handleWeekScrollBackward
  const handleWeekScrollForward = () => {
    const scrollRef =
      forwardTarget?.current ?? allRefs?.current?.[weekDayStepValue].current;
    scrollRef?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    recalculateSkipPrevValues(scrollRef);
  };

  // TODO: Unite logic along with recalculateSkipToValues/updateIntersected
  // recalculates forward/backward arrow values once one of them are clicked
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

  // TODO: Unite logic along with handleWeekScrollForward
  const handleWeekScrollBackward = () => {
    const scrollRef = backwardTarget?.current ?? allRefs?.current?.[0].current;
    scrollRef?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });

    recalculateSkipToValues(scrollRef);
  };

  // TODO: Unite logic along with recalculateSkipPrevValues/updateIntersected
  // recalculates forward/backward arrow values once one of them are clicked
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
    <div className={CN.scheduleDaysWrapper}>
      <div className={CN.scheduleDays}>
        {dayDifference > 0 &&
          range(dayDifference).map((dayIndex, i) => (
            <ScheduleDay
              key={dayIndex}
              isScheduleTimeshifted={isScheduleTimeshifted}
              dayDifference={dayDifference}
              liveAndFutureEvents={liveAndFutureEvents}
              firstScheduleDate={firstScheduleDate}
              selectedDayIndex={selectedDayIndex}
              onIndexSelect={onIndexSelect}
              allRefs={allRefs}
              updateIntersected={updateIntersected}
              dayIndex={dayIndex}
              index={i}
            />
          ))}
      </div>
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
    </div>
  );
};
