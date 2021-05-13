import React, { useMemo } from "react";
import classNames from "classnames";
import { getHours, getUnixTime } from "date-fns";
import { range } from "lodash";
import { useCss } from "react-use";

import { PersonalizedVenueEvent, LocatedEvents } from "types/venues";

import { WithVenueId } from "utils/id";
import { MAX_HOUR, MIDDAY_HOUR } from "utils/time";
import { eventStartTime } from "utils/event";

import { calcStartPosition } from "./Schedule.utils";

import { ScheduleRoomEvents } from "../ScheduleRoomEvents";

import "./Schedule.scss";

export interface ScheduleProps {
  locatedEvents: LocatedEvents[];
  personalEvents: WithVenueId<PersonalizedVenueEvent>[];
  isToday: boolean;
}

const MAX_SCHEDULE_START_HOUR = 16;
const NUMBER_OF_PERSONAL_ROOMS = 1;

export const Schedule: React.FC<ScheduleProps> = ({
  locatedEvents,
  personalEvents,
  isToday,
}) => {
  const scheduleStartHour = useMemo(
    () =>
      Math.min(
        ...locatedEvents.map(({ events }) =>
          events.reduce(
            (acc, event) => Math.min(acc, getHours(eventStartTime(event))),
            MAX_SCHEDULE_START_HOUR
          )
        ),
        MAX_SCHEDULE_START_HOUR
      ),
    [locatedEvents]
  );

  const currentTimePosition = calcStartPosition(
    Math.floor(getUnixTime(Date.now())),
    scheduleStartHour
  );

  const roomCells = useMemo(
    () =>
      locatedEvents?.map(({ location, events }) => (
        <div
          key={location.venueId + location.roomTitle + "index"}
          className="ScheduledEvents__room"
        >
          <p className="ScheduledEvents__room-title">
            {location.roomTitle || location.venueTitle || location.venueId}
          </p>
          <span className="ScheduledEvents__events-count">
            {events.length} events
          </span>
        </div>
      )),
    [locatedEvents]
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
    "--room-count": locatedEvents.length + NUMBER_OF_PERSONAL_ROOMS,
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
        {locatedEvents.map(({ location, events }) => (
          <ScheduleRoomEvents
            key={location.venueId + location.roomTitle}
            events={events}
            scheduleStartHour={scheduleStartHour}
          />
        ))}
      </div>
    </div>
  );
};
