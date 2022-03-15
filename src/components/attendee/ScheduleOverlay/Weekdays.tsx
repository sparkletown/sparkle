import React from "react";
import { range } from "lodash";

import { ALWAYS_EMPTY_OBJECT } from "settings";

import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { ScheduleDay } from "./ScheduleDay";

import CN from "./ScheduleOverlay.module.scss";

export type WeekDaysProps = {
  onIndexSelect: React.Dispatch<React.SetStateAction<number>>;
  selectedDayIndex: number;
  isScheduleTimeshifted: boolean;
};

export const Weekdays: React.FC<WeekDaysProps> = ({
  onIndexSelect,
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
              dayIndex={dayIndex}
              index={i}
            />
          ))}
      </div>
    </div>
  );
};
