import React, { useCallback } from "react";

import { AnyVenue } from "types/Firestore";
import { VenueEvent } from "types/VenueEvent";

import { formatHourAndMinute, getCurrentTimeInUTCSeconds } from "utils/time";
import { WithId } from "utils/id";
import { openEventRoomWithCounting } from "utils/useLocationUpdateEffect";

import { useUser } from "hooks/useUser";

import "./EventDisplay.scss";

interface EventDisplayProps {
  event: VenueEvent;
  venue?: WithId<AnyVenue>;
}

export const EventDisplay: React.FC<EventDisplayProps> = ({ event, venue }) => {
  const { user, profile } = useUser();

  const enterEvent = useCallback(() => {
    if (!venue) return;

    openEventRoomWithCounting({ user, profile, venue, event });
  }, [event, profile, user, venue]);

  const isLiveEvent =
    event.start_utc_seconds < getCurrentTimeInUTCSeconds() &&
    event.start_utc_seconds + event.duration_minutes * 60 >
      getCurrentTimeInUTCSeconds();

  return (
    <div
      key={event.name + Math.random().toString()}
      className={`schedule-event-container ${
        isLiveEvent && "schedule-event-container_live"
      }`}
    >
      <div className="schedule-event-time">
        <div className="schedule-event-time-start">
          {formatHourAndMinute(event.start_utc_seconds)}
        </div>
        <div className="schedule-event-time-end">
          {formatHourAndMinute(
            event.start_utc_seconds + event.duration_minutes * 60
          )}
        </div>
        {isLiveEvent && <span className="schedule-event-time-live">Live</span>}
      </div>
      <div className="schedule-event-info">
        <div className="schedule-event-info-title">{event.name}</div>
        <div className="schedule-event-info-description">
          {event.description}
        </div>
        <div className="schedule-event-info-room">
          <div onClick={enterEvent}>
            {event.room ?? "Enter"} {venue && `- ${venue.name}`}
          </div>
        </div>
      </div>
    </div>
  );
};
