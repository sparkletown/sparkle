import React, { FC, useCallback } from "react";

import { VenueEvent } from "types/VenueEvent";

import { venueSelector } from "utils/selectors";
import { currentTimeInUnixEpoch, formatHourAndMinute } from "utils/time";
import { enterRoom } from "utils/useLocationUpdateEffect";
import { openRoomUrl, openUrl, venueInsideUrl } from "utils/url";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

interface LiveEventProps {
  event: VenueEvent;
}

export const LiveEvent: FC<LiveEventProps> = ({ event }) => {
  const { user, profile } = useUser();
  const venue = useSelector(venueSelector);
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
