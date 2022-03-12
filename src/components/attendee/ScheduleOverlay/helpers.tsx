import React, { MutableRefObject, RefObject } from "react";
import classNames from "classnames";
import { IntersectingButton } from "components/attendee/IntersectingButton";
import { addDays } from "date-fns";
import { range } from "lodash";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { ScheduledEvent } from "types/venues";

import { isEventWithinDateAndNotFinished } from "utils/event";
import { formatDayLabel } from "utils/time";

import { Button } from "../Button";

import CN from "./ScheduleOverlay.module.scss";

const minWeekDaysScrollValue = 8;

type WeekDayProp = {
  dayDifference: number;
  firstScheduleDate: Date;
  selectedDayIndex: number;
  liveAndFutureEvents: ScheduledEvent[];
  isScheduleTimeshifted: boolean;
  setSelectedDayIndex: React.Dispatch<React.SetStateAction<number>>;
  allRefs?: MutableRefObject<RefObject<HTMLButtonElement>[]>;
  updateIntersected?: (el: RefObject<HTMLButtonElement>) => void;
};
export const generatedWeekDays = ({
  dayDifference,
  firstScheduleDate,
  selectedDayIndex,
  liveAndFutureEvents,
  isScheduleTimeshifted,
  setSelectedDayIndex,
  allRefs,
  updateIntersected = () => {},
}: WeekDayProp) => {
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

    return dayDifference <= minWeekDaysScrollValue ? (
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
    ) : (
      <IntersectingButton
        key={day.toISOString()}
        disabled={!daysWithEvents}
        onClick={() => {
          setSelectedDayIndex(dayIndex);
        }}
        variant="alternative"
        className={buttonClasses}
        forwardRef={allRefs?.current[i]}
        updateIntersected={updateIntersected}
      >
        {formattedDay}
      </IntersectingButton>
    );
  });
};
