import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { format } from "date-fns";
import { range } from "lodash";
import { useCss } from "react-use";

import { ONE_SECOND_IN_MILLISECONDS } from "utils/time";

import { RoomWithEvents, ScheduleProps } from "./Schedule.types";

import { calcStartPosition } from "./Schedule.utils";

import { ScheduleRoomEvents } from "../ScheduleRoomEvents";

import "./Schedule.scss";

const MAX_SCHEDULE_START_HOUR = 16;
const MAX_HOUR = 24;
const MIDDAY_HOUR = 12;

export const Schedule: React.FC<ScheduleProps> = ({ scheduleDay }) => {
  const getStartHour = useCallback(
    (utcSeconds: number) => {
      return utcSeconds >= scheduleDay.dayStartUtcSeconds
        ? Number(format(utcSeconds * ONE_SECOND_IN_MILLISECONDS, "H"))
        : 0;
    },
    [scheduleDay]
  );

  const roomStartHour = useCallback(
    (room: RoomWithEvents) =>
      room.events?.reduce(
        (acc, event) => Math.min(acc, getStartHour(event.start_utc_seconds)),
        MAX_SCHEDULE_START_HOUR
      ) ?? MAX_SCHEDULE_START_HOUR,
    [getStartHour]
  );

  const scheduleStartHour = useMemo(
    () =>
      Math.min(
        ...scheduleDay.rooms.map((room) => roomStartHour(room)),
        MAX_SCHEDULE_START_HOUR
      ),
    [scheduleDay, roomStartHour]
  );

  const hours = useMemo(
    () =>
      range(scheduleStartHour, MAX_HOUR).map(
        (hour: number) =>
          `${hour % MIDDAY_HOUR || MIDDAY_HOUR} ${
            hour >= MIDDAY_HOUR ? "PM" : "AM"
          }`
      ),
    [scheduleStartHour]
  );

  const containerVars = useCss({
    "--room-count": scheduleDay.rooms.length + 1,
    "--current-time--position": calcStartPosition(
      Math.floor(Date.now() / ONE_SECOND_IN_MILLISECONDS),
      scheduleStartHour
    ),
    "--hours-count": hours.length,
  });

  const containerClasses = useMemo(
    () => classNames("ScheduledEvents", containerVars),
    [containerVars]
  );

  return (
    <div className={containerClasses}>
      <div className="ScheduledEvents__rooms">
        <div className="ScheduledEvents__room">
          <p className="ScheduledEvents__room-title">My Daily Schedule</p>
          <span className="ScheduledEvents__events-count">
            {scheduleDay.personalEvents.length} events
          </span>
        </div>
        {scheduleDay.rooms.map((room) => (
          <div key={room.title} className="ScheduledEvents__room">
            <p className="ScheduledEvents__room-title">{room.title}</p>
            <span className="ScheduledEvents__events-count">
              {room.events?.length || 0} events
            </span>
          </div>
        ))}
      </div>

      <div className="ScheduledEvents__schedule">
        <div className="ScheduledEvents__timeline">
          {hours.map((hour: string) => (
            <span className="ScheduledEvents__hour" key={hour}>
              {hour}
            </span>
          ))}
        </div>

        {scheduleDay.isToday && (
          <div className="ScheduledEvents__current-time-line"></div>
        )}

        <div className="ScheduledEvents__user-schedule">
          <ScheduleRoomEvents
            isUsers
            events={scheduleDay.personalEvents}
            scheduleStartHour={scheduleStartHour}
          />
        </div>
        {scheduleDay.rooms.map((room) => (
          <ScheduleRoomEvents
            key={room.title}
            events={room.events}
            scheduleStartHour={scheduleStartHour}
          />
        ))}
      </div>
    </div>
  );
};
