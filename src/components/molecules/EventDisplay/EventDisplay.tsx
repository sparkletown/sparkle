import React, { useMemo } from "react";
import classNames from "classnames";

import { AnyVenue, VenueEvent } from "types/venues";
import { Room } from "types/rooms";

import { formatHourAndMinute, getCurrentTimeInUTCSeconds } from "utils/time";
import { WithId } from "utils/id";

import { useRoom } from "hooks/useRoom";

import "./EventDisplay.scss";

export interface EventDisplayProps {
  event: VenueEvent;
  venue?: WithId<AnyVenue>;
}

/**
 * @dept the componnet is used in the OnlineStats and VenuePreview (Playa) which are to be removed as part of the Playa cleanup work.
 *
 * @see https://github.com/sparkletown/sparkle/pull/833
 *
 * @deprecated since https://github.com/sparkletown/sparkle/pull/1302 is merged; the component is replaced by ScheduleEvent
 */
export const EventDisplay: React.FC<EventDisplayProps> = ({ event, venue }) => {
  const eventRoomTitle = event.room;

  const room = useMemo(
    () => venue?.rooms?.find((room) => room.title === eventRoomTitle),
    [venue, eventRoomTitle]
  );

  const buttonText = `${event.room ?? "Enter"} ${venue && `- ${venue.name}`}`;

  const isLiveEvent =
    event.start_utc_seconds < getCurrentTimeInUTCSeconds() &&
    event.start_utc_seconds + event.duration_minutes * 60 >
      getCurrentTimeInUTCSeconds();

  const containerClasses = classNames("schedule-event-container", {
    "schedule-event-container--live": isLiveEvent,
  });

  return (
    <div className={containerClasses}>
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
          {event.room && room && venue ? (
            <EnterRoomButton room={room} venue={venue}>
              {buttonText}
            </EnterRoomButton>
          ) : (
            <div>{buttonText}</div>
          )}
        </div>
      </div>
    </div>
  );
};

interface EnterRoomButtonProps {
  room: Room;
  venue: WithId<AnyVenue>;
}

const EnterRoomButton: React.FC<EnterRoomButtonProps> = ({
  room,
  venue,
  children,
}) => {
  const { enterRoom } = useRoom({ room, venueName: venue.name });

  return <div onClick={enterRoom}>{children}</div>;
};
