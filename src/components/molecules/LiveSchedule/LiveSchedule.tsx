import React, { FC, useCallback, useMemo } from "react";

import { VenueEvent } from "types/VenueEvent";

import { isEventLive } from "utils/event";
import { venueSelector } from "utils/selectors";
import { WithVenueId } from "utils/id";

import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import { LiveEvent } from "./LiveEvent";

import "./LiveSchedule.scss";
import { hasElements } from "utils/types";

const LiveSchedule: FC = () => {
  const venueId = useVenueId();
  const currentVenue = useSelector(venueSelector);
  useConnectRelatedVenues({ venueId });

  const { relatedVenueEvents, relatedVenues } = useConnectRelatedVenues({
    venueId,
    withEvents: true,
  });

  const relatedVenueFor = useCallback(
    (event: WithVenueId<VenueEvent>) =>
      relatedVenues.find((venue) => venue.id === event.venueId) ?? currentVenue,
    [currentVenue, relatedVenues]
  );

  const events = useMemo(() => {
    return relatedVenueEvents && relatedVenueEvents.length
      ? relatedVenueEvents.filter((event) => isEventLive(event))
      : [];
  }, [relatedVenueEvents]);

  const hasEvents = hasElements(events);

  const renderedEvents = useMemo(() => {
    if (!hasEvents) return null;

    return events.map((event, index) => (
      <LiveEvent
        key={`live-event-${index}`}
        venue={relatedVenueFor(event)}
        event={event}
      />
    ));
  }, [events, hasEvents, relatedVenueFor]);

  if (!hasEvents) {
    return <div className="schedule-event-empty">No live events for now</div>;
  }

  return (
    <div className="schedule-container show">
      <div className="schedule-day-container">{renderedEvents}</div>
    </div>
  );
};

export default LiveSchedule;
