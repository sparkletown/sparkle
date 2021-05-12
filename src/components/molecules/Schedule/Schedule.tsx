import React, { useMemo } from "react";
import classNames from "classnames";
import { getHours, getUnixTime } from "date-fns";
import { range } from "lodash";
import { useCss } from "react-use";

import { RoomWithEvents } from "types/rooms";
import { PersonalizedVenueEvent } from "types/venues";

import { eventStartTime } from "utils/event";
import { WithVenueId } from "utils/id";
import { MAX_HOUR, MIDDAY_HOUR } from "utils/time";

import { calcStartPosition } from "./Schedule.utils";

import { ScheduleRoomEvents } from "../ScheduleRoomEvents";

import "./Schedule.scss";

export interface ScheduleProps {
  rooms: RoomWithEvents[];
  personalEvents: WithVenueId<PersonalizedVenueEvent>[];
  isToday: boolean;
}

const MAX_SCHEDULE_START_HOUR = 16;
const NUMBER_OF_PERSONAL_ROOMS = 1;

const getRoomStartHour = (room: RoomWithEvents) =>
  room.events.reduce(
    (acc, event) => Math.min(acc, getHours(eventStartTime(event))),
    MAX_SCHEDULE_START_HOUR
  );

export const Schedule: React.FC<ScheduleProps> = ({
  rooms,
  personalEvents,
  isToday,
}) => {
  const scheduleStartHour = useMemo(
    () =>
      Math.min(
        ...rooms.map((room) => getRoomStartHour(room)),
        MAX_SCHEDULE_START_HOUR
      ),
    [rooms]
  );

  const currentTimePosition = calcStartPosition(
    Math.floor(getUnixTime(Date.now())),
    scheduleStartHour
  );

  const roomCells = useMemo(
    () =>
      rooms.map((room) => (
        <div key={room.title} className="ScheduledEvents__room">
          <p className="ScheduledEvents__room-title">{room.title}</p>
          <span className="ScheduledEvents__events-count">
            {room.events.length} events
          </span>
        </div>
      )),
    [rooms]
  );

  const hoursRow = useMemo(
    () =>
      range(scheduleStartHour, MAX_HOUR).map((hour: number) => {
        return (
          <span className="ScheduledEvents__hour" key={hour}>
            {hour % MIDDAY_HOUR || MIDDAY_HOUR}{" "}
            {hour >= MIDDAY_HOUR ? "PM" : "AM"}
          </span>
        );
      }),
    [scheduleStartHour]
  );

  const containerVars = useCss({
    "--room-count": rooms.length + NUMBER_OF_PERSONAL_ROOMS,
    "--current-time--position": currentTimePosition,
    "--hours-count": hoursRow.length,
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
            {personalEvents.length} events
          </span>
        </div>
        {roomCells}
      </div>

      <div className="ScheduledEvents__schedule">
        <div className="ScheduledEvents__timeline">{hoursRow}</div>

        {isToday && <div className="ScheduledEvents__current-time-line"></div>}

        <div className="ScheduledEvents__user-schedule">
          <ScheduleRoomEvents
            isPersonalizedRoom
            events={personalEvents}
            scheduleStartHour={scheduleStartHour}
          />
        </div>
        {rooms.map((room) => (
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
