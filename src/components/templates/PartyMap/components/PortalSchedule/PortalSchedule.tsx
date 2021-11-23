import React from "react";

import { VenueEvent } from "types/venues";

import { isEventLater, isEventLive, isEventSoon } from "utils/event";

import { ScheduleItem } from "..";

import "./PortalSchedule.scss";

const renderPortalEvents = (title: string, events: VenueEvent[]) => {
  return (
    <>
      <p className="PortalSchedule__group-title">{title}</p>
      {events.map((event, index: number) => (
        <ScheduleItem
          // @debt Ideally event.id would always be a unique identifier, but our types suggest it
          //   can be undefined. Because we can't use index as a key by itself (as that is unstable
          //   and causes rendering issues, we construct a key that, while not guaranteed to be unique,
          //   is far less likely to clash
          key={event.id ?? `${event.room}-${event.name}-${index}`}
          event={event}
          expandableDescription
        />
      ))}
    </>
  );
};

interface PortalScheduleProps {
  portalEvents: VenueEvent[];
}

export const PortalSchedule: React.FC<PortalScheduleProps> = ({
  portalEvents,
}) => {
  const liveEvents = portalEvents.filter(isEventLive);
  const soonEvents = portalEvents.filter(isEventSoon);
  const laterEvents = portalEvents.filter(isEventLater);

  return (
    <div className="PortalSchedule">
      {liveEvents.length > 0 && renderPortalEvents("Happening Now", liveEvents)}
      {soonEvents.length > 0 && renderPortalEvents("Starting soon", soonEvents)}
      {laterEvents.length > 0 && renderPortalEvents("Coming up", laterEvents)}
    </div>
  );
};
