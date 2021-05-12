import React from "react";

import { PersonalizedVenueEvent } from "types/venues";

import { WithVenueId } from "utils/id";

import { ScheduleEvent } from "../ScheduleEvent";

import "./ScheduleRoomEvents.scss";

export interface ScheduleRoomEventsProps {
  events: WithVenueId<PersonalizedVenueEvent>[];
  scheduleStartHour: number;
  isPersonalizedRoom?: boolean;
}

export const ScheduleRoomEvents: React.FC<ScheduleRoomEventsProps> = ({
  events,
  scheduleStartHour,
  isPersonalizedRoom,
}) => {
  return (
    <div className="RoomEvents">
      {events.map((event) => (
        <ScheduleEvent
          key={`event-${event.id}`}
          isPersonalizedEvent={isPersonalizedRoom}
          event={event}
          scheduleStartHour={scheduleStartHour}
        />
      ))}
    </div>
  );
};
