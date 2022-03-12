import React, {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
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

import { generatedWeekDays } from "./helpers";

import CN from "./ScheduleOverlay.module.scss";

const weekDayStepValue = 7;
const weekDayStepSkipValue = weekDayStepValue * 2;

type ScrollableWeekDaysProps = {
  setSelectedDayIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedDayIndex: number;
  dayDifference: number;
  isScheduleTimeshifted: boolean;
};
export const ScrollableWeekdays: React.FC<ScrollableWeekDaysProps> = ({
  setSelectedDayIndex,
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

  const weekdays = useMemo(
    () =>
      generatedWeekDays({
        isScheduleTimeshifted,
        dayDifference,
        liveAndFutureEvents,
        firstScheduleDate,
        selectedDayIndex,
        setSelectedDayIndex,
        allRefs,
        updateIntersected,
      }),
    [
      isScheduleTimeshifted,
      dayDifference,
      liveAndFutureEvents,
      firstScheduleDate,
      selectedDayIndex,
      setSelectedDayIndex,
      allRefs,
      updateIntersected,
    ]
  );

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
    const scrollRef = backwardTarget?.current ?? allRefs?.current?.[0].current;
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
    <div className={CN.scheduleDaysWrapper}>
      <div className={CN.scheduleDays}>{weekdays}</div>
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
