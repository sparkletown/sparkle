import React, { useState, useMemo, FC, MouseEventHandler } from "react";
import { startOfToday } from "date-fns";
import { range } from "lodash";
import classNames from "classnames";

import { isEventLiveOrFuture } from "utils/event";

import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";
import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";

import { Schedule } from "components/molecules/Schedule";
import { ScheduleVenueDescription } from "components/molecules/ScheduleVenueDescription";

import { ScheduleDay } from "components/molecules/Schedule/Schedule.types";

import { scheduleDayBuilder } from "./utils";

import "./SchedulePageModal.scss";

const DAYS_AHEAD = 7;

interface SchedulePageModalProps {
  isVisible?: boolean;
}

export const emptyPersonalizedSchedule = {};

export const SchedulePageModal: FC<SchedulePageModalProps> = ({
  isVisible,
}) => {
  const venueId = useVenueId();
  const { userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? emptyPersonalizedSchedule;

  const { relatedVenueEvents, relatedVenues } = useConnectRelatedVenues({
    venueId,
    withEvents: true,
  });

  const relatedRooms = useMemo(
    () => relatedVenues.flatMap((venue) => venue.rooms ?? []),
    [relatedVenues]
  );

  const schedule: ScheduleDay[] = useMemo(() => {
    const liveAndFutureEvents = relatedVenueEvents.filter(isEventLiveOrFuture);
    const today = startOfToday();
    const buildScheduleEvent = scheduleDayBuilder(
      today,
      liveAndFutureEvents,
      relatedRooms,
      userEventIds
    );

    return range(0, DAYS_AHEAD).map((dayIndex) => buildScheduleEvent(dayIndex));
  }, [relatedVenueEvents, relatedRooms, userEventIds]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const weekdays = useMemo(
    () =>
      schedule.map((day, index) => {
        const classes = classNames("SchedulePageModal__weekday", {
          "SchedulePageModal__weekday--active": index === selectedDayIndex,
        });

        const onWeekdayClick: MouseEventHandler<HTMLLIElement> = (e) => {
          e.stopPropagation();
          setSelectedDayIndex(index);
        };

        return (
          <li
            key={day.dayStartUtcSeconds}
            className={classes}
            onClick={onWeekdayClick}
          >
            {day.isToday ? "Today" : day.weekday}
          </li>
        );
      }),
    [schedule, selectedDayIndex]
  );

  const containerClasses = classNames("SchedulePageModal", {
    "SchedulePageModal--show": isVisible,
  });

  return (
    <div className={containerClasses}>
      <ScheduleVenueDescription />

      <ul className="SchedulePageModal__weekdays">{weekdays}</ul>

      {schedule[selectedDayIndex].rooms.length > 0 ? (
        <Schedule scheduleDay={schedule[selectedDayIndex]} />
      ) : (
        <div className="SchedulePageModal__no-events">No events scheduled</div>
      )}
    </div>
  );
};
