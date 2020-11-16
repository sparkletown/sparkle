import React, { FC, useCallback, useMemo } from "react";

import { VenueEvent } from "types/VenueEvent";

import { isEventLive } from "utils/event";
import { currentTimeInUnixEpoch, formatHourAndMinute } from "utils/time";
import { isExternalUrl } from "utils/url";
import { enterRoom } from "utils/useLocationUpdateEffect";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import "./LiveSchedule.scss";

const LiveSchedule: FC = () => {
  const { user, profile } = useUser();
  const { venueEvents, venue } = useSelector((state) => ({
    venueEvents: state.firestore.ordered.venueEvents,
    venue: state.firestore.ordered.currentVenue[0],
  }));

  const liveEvents = useMemo(() => {
    return venueEvents && venueEvents.length
      ? venueEvents.filter((event) => isEventLive(event))
      : [];
  }, [venueEvents]);

  const onEventClick = useCallback(
    (event: VenueEvent) => {
      const room = venue?.rooms?.find((room) => room.title === event.room);

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
    },
    [profile, user, venue]
  );

  const hasLiveEvents = !!liveEvents.length;

  return (
    <div className="schedule-container show">
      {hasLiveEvents && (
        <div className="schedule-day-container">
          {liveEvents.map((liveEvent, index) => {
            return (
              <div
                key={`live-event-${index}`}
                className="schedule-event-container schedule-event-container_live"
              >
                <div className="schedule-event-time">
                  <div className="schedule-event-time-start">
                    {formatHourAndMinute(liveEvent.start_utc_seconds)}
                  </div>
                  <div className="schedule-event-time-end">
                    {formatHourAndMinute(
                      liveEvent.start_utc_seconds +
                        60 * liveEvent.duration_minutes
                    )}
                  </div>
                  <span className="schedule-event-time-live">Live</span>
                </div>
                <div className="schedule-event-info">
                  <div className="schedule-event-info-title">
                    {liveEvent.name}
                  </div>
                  <div className="schedule-event-info-description">
                    {liveEvent.description}
                  </div>
                  <div className="schedule-event-info-room">
                    <div onClick={() => onEventClick(liveEvent)}>
                      {liveEvent.room}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!hasLiveEvents && (
        <div className="schedule-event-empty">No live events for now</div>
      )}
    </div>
  );
};

export default LiveSchedule;
