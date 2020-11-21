import React, { FC, useMemo } from "react";

import { isEventLive } from "utils/event";

import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";
import { useVenueId } from "hooks/useVenueId";

import { LiveEvent } from "./LiveEvent";

import "./LiveSchedule.scss";

const LiveSchedule: FC = () => {
  const venueId = useVenueId();
  useConnectRelatedVenues({ venueId });

  const { relatedVenueEvents } = useConnectRelatedVenues({
    venueId,
    withEvents: true,
  });

  const liveEvents = useMemo(() => {
    return relatedVenueEvents && relatedVenueEvents.length
      ? relatedVenueEvents.filter((event) => isEventLive(event))
      : [];
  }, [relatedVenueEvents]);

  const hasLiveEvents = !!liveEvents.length;

  if (!hasLiveEvents) {
    return <div className="schedule-event-empty">No live events for now</div>;
  }

  return (
    <div className="schedule-container show">
      <div className="schedule-day-container">
        {liveEvents.map((liveEvent, index) => (
          <LiveEvent key={`live-event-${index}`} liveEvent={liveEvent} />
        ))}
      </div>
    </div>
  );
};

export default LiveSchedule;
