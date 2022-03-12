import React, { useMemo } from "react";

import { ALWAYS_EMPTY_OBJECT } from "settings";

import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { generatedWeekDays } from "./helpers";

import CN from "./ScheduleOverlay.module.scss";

type WeekDaysProps = {
  setSelectedDayIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedDayIndex: number;
  isScheduleTimeshifted: boolean;
};
export const Weekdays: React.FC<WeekDaysProps> = ({
  setSelectedDayIndex,
  selectedDayIndex,
  isScheduleTimeshifted,
}) => {
  const { userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? ALWAYS_EMPTY_OBJECT;

  const {
    dayDifference,
    firstScheduleDate,
    liveAndFutureEvents,
  } = useVenueScheduleEvents({ userEventIds });

  const weekdays = useMemo(
    () =>
      generatedWeekDays({
        isScheduleTimeshifted,
        dayDifference,
        liveAndFutureEvents,
        firstScheduleDate,
        selectedDayIndex,
        setSelectedDayIndex,
      }),
    [
      isScheduleTimeshifted,
      dayDifference,
      liveAndFutureEvents,
      firstScheduleDate,
      selectedDayIndex,
      setSelectedDayIndex,
    ]
  );

  return (
    <div className={CN.scheduleDaysWrapper}>
      <div className={CN.scheduleDays}>{weekdays}</div>
    </div>
  );
};
