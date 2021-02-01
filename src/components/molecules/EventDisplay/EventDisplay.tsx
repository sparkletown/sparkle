import React, { useMemo } from "react";
import classNames from "classnames";

import { AnyVenue, VenueEvent } from "types/venues";
import { Room } from "types/rooms";

import { formatHourAndMinute, getCurrentTimeInUTCSeconds } from "utils/time";
import { WithId } from "utils/id";

import { useRoom } from "hooks/useRoom";

import "./EventDisplay.scss";

interface EventDisplayProps {
  event: VenueEvent;
  venue?: WithId<AnyVenue>;
}

export const EventDisplay: React.FC<EventDisplayProps> = ({ event, venue }) => {
  const eventRoomTitle = event.room;

  const room = useMemo(
    () => venue?.rooms?.find((room) => room.title === eventRoomTitle),
    [eventRoomTitle]
  );

  const buttonText = `${event.room ?? "Enter"} ${venue && `- ${venue.name}`}`;

  const isLiveEvent =
    event.start_utc_seconds < getCurrentTimeInUTCSeconds() &&
    event.start_utc_seconds + event.duration_minutes * 60 >
      getCurrentTimeInUTCSeconds();

  const containerClasses = classNames("schedule-event-container", {
    "schedule-event-container_live": isLiveEvent,
  });

  return (
    <div key={event.name} className={containerClasses}>
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
