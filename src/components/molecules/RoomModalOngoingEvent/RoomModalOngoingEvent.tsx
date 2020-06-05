import React from "react";
import "./RoomModalOngoingEvent.scss";
import { Room } from "types/Room";

interface PropsType {
  room: Room;
  enterRoom: () => void;
}

const RoomModalOngoingEvent: React.FunctionComponent<PropsType> = ({
  room,
  enterRoom,
}) => (
  <div className="room-modal-ongoing-event-container">
    {room.events && (
      <>
        <div className="title-container">
          <img
            src="sparkle-icon.png"
            className="sparkle-icon"
            alt="sparkle-icon"
          />
          What's on now
        </div>
        <div className="artist-ongoing-container">
          <div className="event-title">{room.events[0].name}</div>
          <div>
            by <span className="artist-name">{room.events[0].host}</span>
          </div>
        </div>
        <div className="event-description">{room.events[0].text}</div>
        <a
          className="btn btn-primary room-entry-button"
          onClick={() => enterRoom()}
          href={room.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Join the room
        </a>
      </>
    )}
  </div>
);

export default RoomModalOngoingEvent;
