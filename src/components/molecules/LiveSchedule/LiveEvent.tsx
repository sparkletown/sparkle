import React, { FC, useCallback } from "react";

import { Venue } from "types/Venue";
import { VenueEvent } from "types/VenueEvent";

import { currentTimeInUnixEpoch, formatHourAndMinute } from "utils/time";
import { enterRoom, leaveRoom } from "utils/useLocationUpdateEffect";
import { openRoomUrl, openUrl, venueInsideUrl } from "utils/url";
import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

interface LiveEventProps {
  venue: WithId<Venue>;
  event: VenueEvent;
}

export const LiveEvent: FC<LiveEventProps> = ({ venue, event }) => {
  const { user, profile } = useUser();
  const enterLiveEvent = useCallback(() => {
    const room = venue?.rooms?.find((room) => room.title === event.room);

    if (!room) {
      openUrl(venueInsideUrl(venue.id));
      return;
    }

    enterRoom(
      user!,
      { [`${venue.name}/${room.title}`]: currentTimeInUnixEpoch },
      profile?.lastSeenIn
    );
    openRoomUrl(room.url);
  }, [event, profile, user, venue]);

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
          <div onClick={enterLiveEvent}>{event.room ?? "Enter"}</div>
        </div>
      </div>
    </div>
  );
};
