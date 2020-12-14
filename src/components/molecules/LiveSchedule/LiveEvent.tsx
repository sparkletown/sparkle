import React, { FC, useCallback } from "react";

import { Venue } from "types/Venue";
import { VenueEvent } from "types/VenueEvent";

import { formatHourAndMinute } from "utils/time";
import { openEventRoomWithCounting } from "utils/useLocationUpdateEffect";
import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

interface LiveEventProps {
  venue?: WithId<Venue>;
  event?: VenueEvent;
}

export const LiveEvent: FC<LiveEventProps> = ({ venue, event }) => {
  const { user, profile } = useUser();

  const enterLiveEvent = useCallback(() => {
    if (venue && event) {
      openEventRoomWithCounting({ user, profile, venue, event });
    }
  }, [event, profile, user, venue]);

  if (!event) return null;

  return (
    <div className="schedule-event-container schedule-event-container_live">
      <div className="schedule-event-time">
        <div className="schedule-event-time-start">
          {formatHourAndMinute(event.start_utc_seconds)}
        </div>
        <div className="schedule-event-time-end">
          {formatHourAndMinute(
            event.start_utc_seconds + 60 * event.duration_minutes
          )}
        </div>
        <span className="schedule-event-time-live">Live</span>
      </div>
      <div className="schedule-event-info">
        <div className="schedule-event-info-title">{event.name}</div>
        <div className="schedule-event-info-description">
          {event.description}
        </div>
        <div className="schedule-event-info-room">
          <div onClick={enterLiveEvent}>
            {event.room ?? "Enter"} {venue && `- ${venue.name}`}
          </div>
        </div>
      </div>
    </div>
  );
};
