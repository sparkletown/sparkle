import React, { FC, useMemo } from "react";

import { isEventLive } from "utils/event";
import { venueEventsSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

import "./LiveSchedule.scss";

import { LiveEvent } from "./LiveEvent";

const LiveSchedule: FC = () => {
  const venueEvents = useSelector(venueEventsSelector);

  const liveEvents = useMemo(() => {
    return venueEvents && venueEvents.length
      ? venueEvents.filter((event) => isEventLive(event))
      : [];
  }, [venueEvents]);

  const hasLiveEvents = !!liveEvents.length;

  if (!hasLiveEvents) {
    return <div className="schedule-event-empty">No live events for now</div>;
  }

  return (
    <div className="schedule-container show">
      <div className="schedule-day-container">
        {liveEvents.map((liveEvent, index) => {
          return (
            <LiveEvent key={`live-event-${index}`} liveEvent={liveEvent} />
          );
        })}
      </div>
    </div>
  );
};

export default LiveSchedule;
