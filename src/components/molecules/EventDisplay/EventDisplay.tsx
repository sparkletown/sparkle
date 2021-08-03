import React, { useMemo } from "react";
import classNames from "classnames";

import { AnyVenue, VenueEvent } from "types/venues";
import { Room } from "types/rooms";

import { eventEndTime, eventStartTime } from "utils/event";
import { WithId } from "utils/id";
import { formatTimeLocalised, getCurrentTimeInUTCSeconds } from "utils/time";

import { useRoom } from "hooks/useRoom";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

export interface EventDisplayProps {
  event: VenueEvent;
  venue?: WithId<AnyVenue>;
}

/**
 * @dept the component is used in the OnlineStats and VenuePreview (Playa) which are to be removed as part of the Playa cleanup work.
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

  // @debt there is no css rules defined for any of the following class names at the moment:
  //  schedule-event-container, schedule-event-container--live, schedule-event-time, schedule-event-time-start, schedule-event-time-end,
  //  schedule-event-time-live, schedule-event-info, schedule-event-info-title, schedule-event-info-description, schedule-event-info-room
  const containerClasses = classNames("schedule-event-container", {
    "schedule-event-container--live": isLiveEvent,
  });

  return (
    <div className={containerClasses}>
      <div className="schedule-event-time">
        <div className="schedule-event-time-start">
          {formatTimeLocalised(eventStartTime(event))}
        </div>
        <div className="schedule-event-time-end">
          {formatTimeLocalised(eventEndTime(event))}
        </div>
        {isLiveEvent && <span className="schedule-event-time-live">Live</span>}
      </div>
      <div className="schedule-event-info">
        <div className="schedule-event-info-title">{event.name}</div>
        <div className="schedule-event-info-description">
          <RenderMarkdown text={event.description} />
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
