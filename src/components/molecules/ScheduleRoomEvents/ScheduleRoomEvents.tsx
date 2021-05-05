import React from "react";

import { PersonalizedVenueEvent } from "types/venues";

import { WithVenueId } from "utils/id";

import { ScheduleEvent } from "../ScheduleEvent";

import "./ScheduleRoomEvents.scss";

export interface ScheduleRoomEventsProps {
  events: WithVenueId<PersonalizedVenueEvent>[];
  scheduleStartHour: number;
  isUsers?: boolean;
}

export const ScheduleRoomEvents: React.FC<ScheduleRoomEventsProps> = ({
  events,
  scheduleStartHour,
  isUsers,
}) => {
  return (
    <div className="RoomEvents">
      {events.map((event, index) => (
        <ScheduleEvent
          key={`event-${event.id}-${index}`}
          isUsers={isUsers}
          event={event}
          scheduleStartHour={scheduleStartHour}
        />
      ))}
    </div>
  );
};
