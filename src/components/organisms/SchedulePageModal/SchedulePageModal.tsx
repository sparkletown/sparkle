import React, { useState, useMemo, FC, MouseEventHandler } from "react";
import { addDays, startOfDay, format, getUnixTime } from "date-fns";
import { range } from "lodash";
import classNames from "classnames";

import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";
import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";

import { Schedule } from "components/molecules/Schedule";
import { ScheduleVenueDescription } from "components/molecules/ScheduleVenueDescription";

import { ScheduleDay } from "components/molecules/Schedule/Schedule.types";

import {
  extendVenuesWithDaysEvents,
  isEventLaterThisDay,
  prepareForSchedule,
} from "./utils";

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

  // const relatedRooms = useMemo(
  //   () => relatedVenues.flatMap((venue) => venue.id ?? []),
  //   [relatedVenues]
  // );

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const weekdays = useMemo(() => {
    const today = startOfDay(startOfDay(new Date(2021, 5, 21))); //startOfToday()); //new Date(2021, 5, 21)); //

    return range(0, DAYS_AHEAD).map((dayIndex) => {
      const day = addDays(today, dayIndex);
      const classes = classNames("SchedulePageModal__weekday", {
        "SchedulePageModal__weekday--active": dayIndex === selectedDayIndex,
      });

      const onWeekdayClick: MouseEventHandler<HTMLLIElement> = (e) => {
        e.stopPropagation();
        setSelectedDayIndex(dayIndex);
      };

      return (
        <li
          key={day.toISOString()}
          className={classes}
          onClick={onWeekdayClick}
        >
          {dayIndex === 0 ? "Today" : format(day, "E, LLL d")}
        </li>
      );
    });
  }, [selectedDayIndex]);

  const schedule: ScheduleDay = useMemo(() => {
    const dayStart = addDays(startOfDay(new Date(21, 5, 21)), selectedDayIndex);
    const daysEvents = relatedVenueEvents
      .filter(
        isEventLaterThisDay(
          selectedDayIndex === 0 ? new Date(2021, 5, 21) : dayStart
        )
      )
      .map(prepareForSchedule(dayStart, userEventIds));

    const venueNamesInSchedule = new Set(
      daysEvents.map((event) => event.venueId)
    );

    const venuesWithEvents = extendVenuesWithDaysEvents(
      relatedVenues.filter((venue) => venueNamesInSchedule.has(venue.id)),
      daysEvents
    );

    return {
      isToday: selectedDayIndex === 0,
      weekday: format(dayStart, "E, LLL, d"),
      dayStartUtcSeconds: getUnixTime(dayStart),
      venues: venuesWithEvents,
      personalEvents: daysEvents.filter((event) => event.isSaved),
    };
  }, [relatedVenueEvents, relatedVenues, userEventIds, selectedDayIndex]);

  const containerClasses = classNames("SchedulePageModal", {
    "SchedulePageModal--show": isVisible,
  });

  return (
    <div className={containerClasses}>
      <ScheduleVenueDescription />

      <ul className="SchedulePageModal__weekdays">{weekdays}</ul>

      {schedule.venues.length > 0 ? (
        <Schedule scheduleDay={schedule} />
      ) : (
        <div className="SchedulePageModal__no-events">No events scheduled</div>
      )}
    </div>
  );
};
