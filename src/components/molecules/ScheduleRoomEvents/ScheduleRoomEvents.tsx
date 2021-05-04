import React from "react";
import { VenueEvent } from "types/venues";

import { ScheduleEvent } from "../ScheduleEvent";

import "./ScheduleRoomEvents.scss";

export interface ScheduleRoomEventsProps {
  events: VenueEvent[];
  scheduleStartHour: number;
  onEventBookmarked: Function;
  isUsers?: boolean;
}

export const ScheduleRoomEvents: React.FC<ScheduleRoomEventsProps> = ({
  events,
  scheduleStartHour,
  onEventBookmarked,
  isUsers,
}) => {
  return (
    <div className="RoomEvents">
      {events.map((event, index) => (
        <ScheduleEvent
          key={`event-${index}`}
          isUsers={isUsers}
          event={event}
          scheduleStartHour={scheduleStartHour}
          onEventBookmarked={onEventBookmarked}
        />
      ))}
    </div>
  );
};
