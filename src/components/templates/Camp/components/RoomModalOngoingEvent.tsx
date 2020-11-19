import React from "react";

import { retainAttendance } from "store/actions/Attendance";

import { CampRoomData } from "types/CampRoomData";
import { VenueEvent } from "types/VenueEvent";

import { getCurrentEvent } from "utils/event";
import { isExternalUrl } from "utils/url";

import { useDispatch } from "hooks/useDispatch";

import "./RoomModalOngoingEvent.scss";

interface RoomModalOngoingEventProps {
  room: CampRoomData;
  roomEvents: VenueEvent[];
  enterRoom: () => void;
  joinButtonText?: string;
}

export const RoomModalOngoingEvent: React.FC<RoomModalOngoingEventProps> = ({
  room,
  roomEvents,
  enterRoom,
  joinButtonText,
}) => {
  const dispatch = useDispatch();
  const currentEvent = roomEvents && getCurrentEvent(roomEvents);
  const eventToDisplay =
    roomEvents &&
    roomEvents.length > 0 &&
    (currentEvent ? currentEvent : roomEvents[0]);

  return (
    <div className="room-modal-ongoing-event-container">
      {eventToDisplay && (
        <>
          <div className="title-container">
            <img
              src="/sparkle-icon.png"
              className="sparkle-icon"
              alt="sparkle-icon"
            />
            {currentEvent ? "What's on now" : "What's on next"}
          </div>
          <div className="artist-ongoing-container">
            <div className="event-title">{eventToDisplay.name}</div>
            <div>
              by <span className="artist-name">{eventToDisplay.host}</span>
            </div>
          </div>
          <div className="event-description">{eventToDisplay.description}</div>
        </>
      )}
      {!eventToDisplay && (
        <>
          <div className="event-description">
            <img
              src="/sparkle-icon.png"
              className="sparkle-icon"
              alt="sparkle-icon"
            />
            No events scheduled
          </div>
        </>
      )}
      {isExternalUrl(room.url) ? (
        <a
          onMouseOver={() => dispatch(retainAttendance(true))}
          onMouseOut={() => dispatch(retainAttendance(false))}
          className="btn btn-primary room-entry-button"
          onClick={enterRoom}
          id={`enter-room-in-ongoing-event-card-${room.title}`}
          href={room.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {joinButtonText ?? "Join the room"}
        </a>
      ) : (
        <a
          onMouseOver={() => dispatch(retainAttendance(true))}
          onMouseOut={() => dispatch(retainAttendance(false))}
          className="btn btn-primary room-entry-button"
          onClick={enterRoom}
          id={`enter-room-in-ongoing-event-card-${room.title}`}
          href={room.url}
        >
          {joinButtonText ?? "Join the room"}
        </a>
      )}
    </div>
  );
};

export default RoomModalOngoingEvent;
