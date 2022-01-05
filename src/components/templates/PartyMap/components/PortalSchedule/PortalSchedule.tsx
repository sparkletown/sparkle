import React, { useCallback } from "react";

import { ALWAYS_EMPTY_OBJECT } from "settings";

import { MyPersonalizedSchedule } from "types/User";
import { WorldExperience } from "types/venues";

import { isEventLater, isEventLive, isEventSoon } from "utils/event";
import { WithVenueId } from "utils/id";
import { arrayIncludes } from "utils/types";

import { useUser } from "hooks/useUser";

import { PortalScheduleItem } from "components/templates/PartyMap/components/PortalScheduleItem";

import "./PortalSchedule.scss";

interface PortalScheduleProps {
  portalEvents: WithVenueId<WorldExperience>[];
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
    (event: WithVenueId<WorldExperience>) =>
      arrayIncludes(userEvents[event.venueId], event.id),
    [userEvents]
  );

  const renderPortalEvents = useCallback(
    (title: string, events: WithVenueId<WorldExperience>[]) => (
      <>
        <p className="PortalSchedule__group-title">{title}</p>
        {events.map((event, index: number) => (
          <PortalScheduleItem
            key={event.id}
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
