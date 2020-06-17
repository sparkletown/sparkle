import React from "react";
import "./RoomModalOngoingEvent.scss";
import { Room } from "types/Room";
import { getCurrentEvent } from "utils/time";

interface PropsType {
  room: Room;
  enterRoom: () => void;
  startUtcSeconds: number;
}

const RoomModalOngoingEvent: React.FunctionComponent<PropsType> = ({
  room,
  enterRoom,
  startUtcSeconds,
}) => {
  const currentEvent = room.events && getCurrentEvent(room, startUtcSeconds);
  const eventToDisplay =
    room.events &&
    room.events.length > 0 &&
    (currentEvent ? currentEvent : room.events[0]);
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
            What's on now
          </div>
          <div className="artist-ongoing-container">
            <div className="event-title">{eventToDisplay.name}</div>
            <div>
              by <span className="artist-name">{eventToDisplay.host}</span>
            </div>
          </div>
          <div className="event-description">{eventToDisplay.text}</div>
          <a
            className="btn btn-primary room-entry-button"
            onClick={() => enterRoom()}
            href={room.data?.external_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {room.button_text || "Join the room"}
          </a>
        </>
      )}
    </div>
  );
};

export default RoomModalOngoingEvent;
