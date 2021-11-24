import React, { useCallback } from "react";

import { ALWAYS_EMPTY_OBJECT } from "settings";

import { MyPersonalizedSchedule } from "types/User";
import { VenueEvent } from "types/venues";

import { isEventLater, isEventLive, isEventSoon } from "utils/event";
import { WithVenueId } from "utils/id";
import { arrayIncludes } from "utils/types";

import { useUser } from "hooks/useUser";

import { PortalScheduleItem } from "..";

import "./PortalSchedule.scss";

interface PortalScheduleProps {
  portalEvents: WithVenueId<VenueEvent>[];
}

export const PortalSchedule: React.FC<PortalScheduleProps> = ({
  portalEvents,
}) => {
  const liveEvents = portalEvents.filter(isEventLive);
  const soonEvents = portalEvents.filter(isEventSoon);
  const laterEvents = portalEvents.filter(isEventLater);

  const { userWithId } = useUser();
  const userEvents: MyPersonalizedSchedule =
    userWithId?.myPersonalizedSchedule ?? ALWAYS_EMPTY_OBJECT;

  const isSavedEvent = useCallback(
    (event: WithVenueId<VenueEvent>) =>
      arrayIncludes(userEvents[event.venueId], event.id),
    [userEvents]
  );

  const renderPortalEvents = useCallback(
    (title: string, events: WithVenueId<VenueEvent>[]) => (
      <>
        <p className="PortalSchedule__group-title">{title}</p>
        {events.map((event, index: number) => (
          <PortalScheduleItem
            // @debt Ideally event.id would always be a unique identifier, but our types suggest it
            //   can be undefined. Because we can't use index as a key by itself (as that is unstable
            //   and causes rendering issues, we construct a key that, while not guaranteed to be unique,
            //   is far less likely to clash
            key={event.id ?? `${event.room}-${event.name}-${index}`}
            event={event}
            expandableDescription
            isSaved={isSavedEvent(event)}
          />
        ))}
      </>
    ),
    [isSavedEvent]
  );

  return (
    <div className="PortalSchedule">
      {liveEvents.length > 0 && renderPortalEvents("Happening Now", liveEvents)}
      {soonEvents.length > 0 && renderPortalEvents("Starting soon", soonEvents)}
      {laterEvents.length > 0 && renderPortalEvents("Coming up", laterEvents)}
    </div>
  );
};
