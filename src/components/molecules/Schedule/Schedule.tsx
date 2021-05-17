import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import {
  eachHourOfInterval,
  endOfDay,
  format,
  getHours,
  getUnixTime,
  setHours,
} from "date-fns";
import { useCss } from "react-use";

import {
  SCHEDULE_CURRENT_TIMELINE_MS,
  SCHEDULE_HOUR_COLUMN_WIDTH_PX,
  SCHEDULE_MAX_START_HOUR,
} from "settings";

import { PersonalizedVenueEvent, LocatedEvents } from "types/venues";

import { eventStartTime } from "utils/event";
import { formatMeasurement } from "utils/formatMeasurement";

import { useInterval } from "hooks/useInterval";

import { ScheduleRoomEvents } from "components/molecules/ScheduleRoomEvents";

import { calcStartPosition } from "./Schedule.utils";

import "./Schedule.scss";

export interface ScheduleProps {
  locatedEvents: LocatedEvents[];
  personalEvents: PersonalizedVenueEvent[];
  scheduleDate: Date;
  isToday: boolean;
}

export const Schedule: React.FC<ScheduleProps> = ({
  locatedEvents,
  personalEvents,
  scheduleDate,
  isToday,
}) => {
  const hasEvents = locatedEvents.length > 0;

  const scheduleStartHour = useMemo(
    () =>
      Math.min(
        ...locatedEvents.map(({ events }) =>
          events.reduce(
            (acc, event) => Math.min(acc, getHours(eventStartTime(event))),
            SCHEDULE_MAX_START_HOUR
          )
        ),
        SCHEDULE_MAX_START_HOUR
      ),
    [locatedEvents]
  );

  const scheduleStartDateTime = useMemo(
    () => setHours(scheduleDate, scheduleStartHour),
    [scheduleStartHour, scheduleDate]
  );

  const roomCells = useMemo(
    () =>
      locatedEvents?.map(({ location, events }) => (
        <div
          key={`RoomCell-${location.venueId}-${location.roomTitle}`}
          className="Schedule__room"
        >
          <p className="Schedule__room-title">
            {location.roomTitle || location.venueTitle || location.venueId}
          </p>
          <span className="Schedule__events-count">
            {formatMeasurement(events.length, "event")}
          </span>
        </div>
      )),
    [locatedEvents]
  );

  const hoursRow = useMemo(
    () =>
      eachHourOfInterval({
        start: scheduleStartDateTime,
        end: endOfDay(scheduleStartDateTime),
      }).map((scheduleHour) => (
        <span className="Schedule__hour" key={scheduleHour.toISOString()}>
          {format(scheduleHour, "h a")}
        </span>
      )),
    [scheduleStartDateTime]
  );

  const calcCurrentTimePosition = useCallback(
    () => calcStartPosition(getUnixTime(Date.now()), scheduleStartHour),
    [scheduleStartHour]
  );

  const [currentTimePosition, setCurrentTimePosition] = useState(
    calcCurrentTimePosition()
  );

  useInterval(() => {
    setCurrentTimePosition(calcCurrentTimePosition());
  }, SCHEDULE_CURRENT_TIMELINE_MS);

  const containerVars = useCss({
    "--room-count": locatedEvents.length + 1, // +1 is needed for the 1st personalized line of the schedule
    "--current-time--position": currentTimePosition,
    "--hours-count": hoursRow.length,
    "--hour-width": `${SCHEDULE_HOUR_COLUMN_WIDTH_PX}px`,
  });

  const containerClasses = classNames("Schedule", containerVars);

  const rowsWithTheEvents = useMemo(
    () =>
      locatedEvents.map(({ location, events }) => (
        <ScheduleRoomEvents
          key={`ScheduleRoomEvents-${location.venueId}-${location.roomTitle}`}
          events={events}
          scheduleStartHour={scheduleStartHour}
        />
      )),
    [locatedEvents, scheduleStartHour]
  );

  return (
    <div className={containerClasses}>
      {hasEvents ? (
        <>
          <div className="Schedule__rooms">
            <div className="Schedule__room">
              <p className="Schedule__room-title">My Daily Schedule</p>
              <span className="Schedule__events-count">
                {personalEvents.length} events
              </span>
            </div>

            {roomCells}
          </div>

          <div className="Schedule__schedule">
            <div className="Schedule__timeline">{hoursRow}</div>

            {isToday && <div className="Schedule__current-time-line" />}

            <div className="Schedule__user-schedule">
              <ScheduleRoomEvents
                personalizedRoom
                events={personalEvents}
                scheduleStartHour={scheduleStartHour}
              />
            </div>

            {rowsWithTheEvents}
          </div>
        </>
      ) : (
        <div className="Schedule__no-events">No events scheduled</div>
      )}
    </div>
  );
};
