import React, { FC, useCallback, useMemo } from "react";

import { AnyVenue, VenueEvent } from "types/venues";

import { isEventLive } from "utils/event";
import { venueSelector } from "utils/selectors";
import { WithId, WithVenueId } from "utils/id";

// import { useLegacyConnectRelatedVenues } from "hooks/useRelatedVenues";
import { useSelector } from "hooks/useSelector";
// import { useVenueId } from "hooks/useVenueId";

import { EventDisplay } from "../EventDisplay";

import "./LiveSchedule.scss";
import { hasElements } from "utils/types";

const emptyArray: never[] = [];

const LiveSchedule: FC = () => {
  // const venueId = useVenueId();
  const currentVenue = useSelector(venueSelector);

  // @debt Stubbing out legacy code as this component isn't used anymore and is getting deleted in a different PR.
  // useLegacyConnectRelatedVenues({ venueId });
  //
  // const { relatedVenueEvents, relatedVenues } = useLegacyConnectRelatedVenues({
  //   venueId,
  //   withEvents: true,
  // });
  const relatedVenues: WithId<AnyVenue>[] = emptyArray;
  const relatedVenueEvents: WithVenueId<VenueEvent>[] = emptyArray;

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
      <EventDisplay
        key={event.id ?? `${index}-${event.name}`}
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
