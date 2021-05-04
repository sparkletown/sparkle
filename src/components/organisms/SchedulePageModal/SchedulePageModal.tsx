import React, {
  useState,
  useMemo,
  FC,
  useEffect,
  useCallback,
  MouseEventHandler,
} from "react";
import { startOfDay } from "date-fns";
import { range } from "lodash";
import classNames from "classnames";

import { Room } from "types/rooms";

import { formatDate } from "utils/time";
import { isEventLiveOrFuture } from "utils/event";

import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";
import { useVenueId } from "hooks/useVenueId";

import { Schedule } from "components/molecules/Schedule";
import { ScheduleDay } from "components/molecules/Schedule/Schedule";
import { ScheduleVenueDescription } from "components/molecules/ScheduleVenueDescription";

import { scheduleDayBuilder } from "./SchedulePageModal.utils";

import "./SchedulePageModal.scss";

const DAYS_AHEAD = 7;

interface SchedulePageModalProps {
  isVisible?: boolean;
}

export const SchedulePageModal: FC<SchedulePageModalProps> = ({
  isVisible,
}) => {
  const venueId = useVenueId();

  const { relatedVenueEvents, relatedVenues } = useConnectRelatedVenues({
    venueId,
    withEvents: true,
  });

  const [relatedRooms, setRelatedRooms] = useState<Room[]>([]);

  useEffect(() => {
    const rooms: Room[] = [];
    relatedVenues
      .map((venue) => venue.rooms || [])
      .forEach((venueRooms) => rooms.push(...venueRooms));
    setRelatedRooms(rooms);
  }, [relatedVenues]);

  const schedule: ScheduleDay[] = useMemo(() => {
    const liveAndFutureEvents = relatedVenueEvents.filter(isEventLiveOrFuture);
    const today = startOfDay(Date.now());
    const buildScheduleEvent = scheduleDayBuilder(
      today,
      liveAndFutureEvents,
      relatedRooms
    );

    return range(0, DAYS_AHEAD).map((dayIndex) => buildScheduleEvent(dayIndex));
  }, [relatedVenueEvents, relatedRooms]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const onWeekdayClick = useCallback(
    (index: number): MouseEventHandler<HTMLLIElement> => (e) => {
      e.stopPropagation();
      setSelectedDayIndex(index);
    },
    []
  );

  const weekdayClasses = useCallback(
    (index) =>
      classNames("SchedulePageModal__weekday", {
        "SchedulePageModal__weekday--active": index === selectedDayIndex,
      }),
    [selectedDayIndex]
  );

  const weekdays = useMemo(
    () =>
      schedule.map((day, index) => (
        <li
          key={formatDate(day.dayStartUtcSeconds)}
          className={weekdayClasses(index)}
          onClick={onWeekdayClick(index)}
        >
          {day.isToday ? "Today" : day.weekday}
        </li>
      )),
    [schedule, weekdayClasses, onWeekdayClick]
  );

  const containerClasses = useMemo(
    () =>
      classNames("SchedulePageModal", { "SchedulePageModal--show": isVisible }),
    [isVisible]
  );

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
