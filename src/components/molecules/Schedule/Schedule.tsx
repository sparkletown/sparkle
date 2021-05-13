import React, { useMemo } from "react";
import classNames from "classnames";
import { getHours, getUnixTime } from "date-fns";
import { range } from "lodash";
import { useCss } from "react-use";

import {
  SCHEDULE_HOUR_COLUMN_WIDTH_PX,
  SCHEDULE_MAX_START_HOUR,
  SCHEDULE_NUMBER_OF_PERSONAL_ROOMS,
} from "settings";

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
            SCHEDULE_MAX_START_HOUR
          )
        ),
        SCHEDULE_MAX_START_HOUR
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
    "--room-count": locatedEvents.length + SCHEDULE_NUMBER_OF_PERSONAL_ROOMS,
    "--current-time--position": currentTimePosition,
    "--hours-count": hoursRow.length,
    "--hour-width": `${SCHEDULE_HOUR_COLUMN_WIDTH_PX}px`,
  });

  const containerClasses = useMemo(
    () => classNames("ScheduledEvents", containerVars),
    [containerVars]
  );

  const rowsWithTheEvents = useMemo(
    () =>
      locatedEvents.map(({ location, events }) => (
        <ScheduleRoomEvents
          key={location.venueId + location.roomTitle}
          events={events}
          scheduleStartHour={scheduleStartHour}
        />
      )),
    [locatedEvents, scheduleStartHour]
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
        {rowsWithTheEvents}
      </div>
    </div>
  );
};
