import React, { useMemo } from "react";

import { PersonalizedVenueEvent } from "types/venues";

import { ScheduleEvent } from "components/molecules/ScheduleEvent";

import "./ScheduleRoomEvents.scss";

export interface ScheduleRoomEventsProps {
  events: PersonalizedVenueEvent[];
  scheduleStartHour: number;
  personalizedRoom?: boolean;
}

export const ScheduleRoomEvents: React.FC<ScheduleRoomEventsProps> = ({
  events,
  scheduleStartHour,
  personalizedRoom,
}) => {
  const eventBlocks = useMemo(
    () =>
      events.map((event) => (
        <ScheduleEvent
          key={`event-${event.id}`}
          personalizedEvent={personalizedRoom}
          event={event}
          scheduleStartHour={scheduleStartHour}
        />
      )),
    [events, personalizedRoom, scheduleStartHour]
  );

  return <div className="ScheduleRoomEvents">{eventBlocks}</div>;
};
