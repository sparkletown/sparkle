import React from "react";
import { WithId } from "utils/id";
import { AnyVenue } from "types/Firestore";
import {
  formatHourAndMinute,
  getCurrentTimeInUTCSeconds,
  currentTimeInUnixEpoch,
} from "utils/time";
import { isExternalUrl } from "utils/url";
import "./EventDisplay.scss";
import { enterRoom } from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";

interface PropsType {
  event: firebase.firestore.DocumentData;
  venue: WithId<AnyVenue>;
  joinNowButton: boolean;
}

export const EventDisplay: React.FunctionComponent<PropsType> = ({
  event,
  venue,
  joinNowButton,
}) => {
  const { user, profile } = useUser();
  const onEventClick = () => {
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
  };
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
          <div onClick={onEventClick}>{event.room}</div>
        </div>
      </div>
    </div>
  );
};
