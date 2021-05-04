import React, { useState } from "react";
import classNames from "classnames";
import { format } from "date-fns";
import { range } from "lodash";
import { useCss } from "react-use";

import { Room } from "types/rooms";
import { VenueEvent } from "types/venues";

import {
  ONE_SECOND_IN_MILLISECONDS,
  ONE_HOUR_IN_SECONDS,
  getSecondsFromStartOfDay,
} from "utils/time";

import { ScheduleRoomEvents } from "../ScheduleRoomEvents";

import "./Schedule.scss";

export type RoomWithEvents = Room & { events: VenueEvent[] };

export interface ScheduleDay {
  isToday: boolean;
  weekday: string;
  dayStartUtcSeconds: number;
  rooms: RoomWithEvents[];
}

export interface ScheduleProps {
  scheduleDay: ScheduleDay;
}

const MAX_SCHEDULE_START_HOUR = 16;
const HOUR_WIDTH = 200; // px

export const Schedule: React.FC<ScheduleProps> = ({ scheduleDay }) => {
  const getStartHour = (utcSeconds: number) => {
    return utcSeconds >= scheduleDay.dayStartUtcSeconds
      ? Number(format(utcSeconds * ONE_SECOND_IN_MILLISECONDS, "H"))
      : 0;
  };

  const roomStartHour = (room: RoomWithEvents) =>
    room.events?.reduce(
      (acc, event) => Math.min(acc, getStartHour(event.start_utc_seconds)),
      MAX_SCHEDULE_START_HOUR
    ) ?? MAX_SCHEDULE_START_HOUR;

  const scheduleStartHour = Math.min(
    ...scheduleDay.rooms.map((room) => roomStartHour(room)),
    MAX_SCHEDULE_START_HOUR
  );

  const hours = range(scheduleStartHour, 24).map(
    (hour: number) => `${hour % 12 || 12} ${hour >= 12 ? "PM" : "AM"}`
  );

  const calcStartPosition = (startTimeUtcSeconds: number) => {
    const startTimeTodaySeconds = getSecondsFromStartOfDay(startTimeUtcSeconds);

    return Math.floor(
      HOUR_WIDTH / 2 +
        (startTimeTodaySeconds / ONE_HOUR_IN_SECONDS - scheduleStartHour) *
          HOUR_WIDTH
    );
  };

  const containerVars = useCss({
    "--room-count": scheduleDay.rooms.length + 1,
    "--current-time--position": calcStartPosition(
      Math.floor(Date.now() / ONE_SECOND_IN_MILLISECONDS)
    ),
    "--hours-count": hours.length,
  });

  const containerClasses = classNames("ScheduledEvents", containerVars);

  const [usersEvents, setUsersEvents] = useState<VenueEvent[]>([]);

  const onEventBookmarked = (isBookmarked: boolean, event: VenueEvent) => {
    console.log("is bookmarked", isBookmarked);
    if (isBookmarked) {
      setUsersEvents([...usersEvents, event]);
    } else {
      setUsersEvents(usersEvents.filter((e) => e.name !== event.name));
    }
  };

  return (
    <div className={containerClasses}>
      <div className="ScheduledEvents__rooms">
        <div className="ScheduledEvents__room">
          <p className="ScheduledEvents__room-title">My Daily Schedule</p>
          <span className="ScheduledEvents__events-count">
            {usersEvents.length} events
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
            isUsers={true}
            events={usersEvents}
            scheduleStartHour={scheduleStartHour}
            onEventBookmarked={onEventBookmarked}
          />
        </div>
        {scheduleDay.rooms.map((room) => (
          <ScheduleRoomEvents
            key={room.title}
            events={room.events}
            scheduleStartHour={scheduleStartHour}
            onEventBookmarked={onEventBookmarked}
          />
        ))}
      </div>
    </div>
  );
};
