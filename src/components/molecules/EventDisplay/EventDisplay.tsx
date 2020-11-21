import React, { FC, useCallback } from "react";

import { AnyVenue } from "types/Firestore";

import {
  formatHourAndMinute,
  getCurrentTimeInUTCSeconds,
  currentTimeInUnixEpoch,
} from "utils/time";
import { WithId } from "utils/id";
import { isExternalUrl, openRoomUrl, venueInsideUrl } from "utils/url";
import { enterRoom } from "utils/useLocationUpdateEffect";

import { useUser } from "hooks/useUser";

import "./EventDisplay.scss";

interface EventDisplayProps {
  event: firebase.firestore.DocumentData;
  venue: WithId<AnyVenue>;
}

export const EventDisplay: FC<EventDisplayProps> = ({ event, venue }) => {
  const { user, profile } = useUser();

  const enterEvent = useCallback(() => {
    const room = venue?.rooms?.find((room) => room.title === event.room);

    if (!room) {
      window.open(venueInsideUrl(venue.id), "_blank", "noopener,noreferrer");
      return;
    }

    enterRoom(
      user!,
      { [`${venue.name}/${room.title}`]: currentTimeInUnixEpoch },
      profile?.lastSeenIn
    );
    openRoomUrl(room.url);
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
          <div onClick={enterEvent}>{event.room}</div>
        </div>
      </div>
    </div>
  );
};
