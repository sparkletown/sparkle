import React, { MutableRefObject, RefObject } from "react";
import classNames from "classnames";
import { IntersectingButton } from "components/attendee/IntersectingButton";
import { addDays } from "date-fns";

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
  onIndexSelect: React.Dispatch<React.SetStateAction<number>>;
  allRefs?: MutableRefObject<RefObject<HTMLButtonElement>[]>;
  updateIntersected?: (el: RefObject<HTMLButtonElement>) => void;
  dayIndex: number;
  index: number;
};

export const ScheduleDay = ({
  dayDifference,
  firstScheduleDate,
  selectedDayIndex,
  liveAndFutureEvents,
  isScheduleTimeshifted,
  onIndexSelect,
  allRefs,
  updateIntersected = () => {},
  dayIndex,
  index,
}: WeekDayProp) => {
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
        onIndexSelect(dayIndex);
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
        onIndexSelect(dayIndex);
      }}
      variant="alternative"
      className={buttonClasses}
      forwardRef={allRefs?.current[index]}
      updateIntersected={updateIntersected}
    >
      {formattedDay}
    </IntersectingButton>
  );
};
