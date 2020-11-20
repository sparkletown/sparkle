import React, { FC, useCallback } from "react";

import { VenueEvent } from "types/VenueEvent";

import { venueSelector } from "utils/selectors";
import { currentTimeInUnixEpoch, formatHourAndMinute } from "utils/time";
import { enterRoom } from "utils/useLocationUpdateEffect";
import { isExternalUrl } from "utils/url";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

interface LiveEventProps {
  liveEvent: VenueEvent;
}

export const LiveEvent: FC<LiveEventProps> = ({ liveEvent }) => {
  const { user, profile } = useUser();
  const venue = useSelector(venueSelector);
  const enterLiveEvent = useCallback(() => {
    const room = venue?.rooms?.find((room) => room.title === liveEvent.room);

    const isExternal = isExternalUrl(room.url);
    if (isExternal) {
      window.open(room.url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = room.url;
    }
    enterRoom(
      user!,
      { [`${venue.name}/${room.title}`]: currentTimeInUnixEpoch },
      profile?.lastSeenIn
    );
  }, [liveEvent, profile, user, venue]);

  return (
    <div className="schedule-event-container schedule-event-container_live">
      <div className="schedule-event-time">
        <div className="schedule-event-time-start">
          {formatHourAndMinute(liveEvent.start_utc_seconds)}
        </div>
        <div className="schedule-event-time-end">
          {formatHourAndMinute(
            liveEvent.start_utc_seconds + 60 * liveEvent.duration_minutes
          )}
        </div>
        <span className="schedule-event-time-live">Live</span>
      </div>
      <div className="schedule-event-info">
        <div className="schedule-event-info-title">{liveEvent.name}</div>
        <div className="schedule-event-info-description">
          {liveEvent.description}
        </div>
        <div className="schedule-event-info-room">
          <div onClick={enterLiveEvent}>{liveEvent.room}</div>
        </div>
      </div>
    </div>
  );
};
