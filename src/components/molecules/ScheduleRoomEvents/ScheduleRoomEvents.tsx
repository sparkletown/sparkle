import React from "react";

import { PersonalizedVenueEvent } from "types/venues";

import { ScheduleEvent } from "components/molecules/ScheduleEvent";

import "./ScheduleRoomEvents.scss";

export interface ScheduleRoomEventsProps {
  events: PersonalizedVenueEvent[];
  scheduleStartHour: number;
  personalizedRoom?: boolean;
}

export const _ScheduleRoomEvents: React.FC<ScheduleRoomEventsProps> = ({
  events,
  scheduleStartHour,
  personalizedRoom,
}) => {
  return (
    <div className="ScheduleRoomEvents">
      {events.map((event) => (
        <ScheduleEvent
          key={`event-${event.id}`}
          personalizedEvent={personalizedRoom}
          event={event}
          scheduleStartHour={scheduleStartHour}
        />
      ))}
    </div>
  );
};

export const ScheduleRoomEvents = React.memo(_ScheduleRoomEvents);
