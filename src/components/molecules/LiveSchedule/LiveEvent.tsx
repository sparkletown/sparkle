import React from "react";

import { Venue, VenueEvent } from "types/venues";
import { Room } from "types/rooms";

import { formatHourAndMinute } from "utils/time";
import { WithId } from "utils/id";

import { useRoom } from "hooks/useRoom";

interface LiveEventProps {
  venue?: WithId<Venue>;
  event?: VenueEvent;
}

export const LiveEvent: React.FC<LiveEventProps> = ({ venue, event }) => {
  const room = venue?.rooms?.find((room) => room.title === event?.room);

  if (!event) return null;

  const buttonText = `${event.room ?? "Enter"} ${venue && `- ${venue.name}`}`;

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
          {event.room && room ? (
            <EnterRoomButton room={room as Room}>{buttonText}</EnterRoomButton>
          ) : (
            <div>{buttonText}</div>
          )}
        </div>
      </div>
    </div>
  );
};

type EnterRoomButtonProps = {
  room: Room;
};

const EnterRoomButton: React.FC<EnterRoomButtonProps> = ({
  room,
  children,
}) => {
  const { enterRoom } = useRoom(room);

  return <div onClick={enterRoom}>{children}</div>;
};
