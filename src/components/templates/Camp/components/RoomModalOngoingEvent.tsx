import React from "react";
import { CampRoomData } from "types/CampRoomData";
import { getCurrentEvent } from "utils/event";
import { VenueEvent } from "types/VenueEvent";

import "../../../templates/PartyMap/components/RoomModalOngoingEvent/RoomModalOngoingEvent.scss";

interface PropsType {
  room: CampRoomData;
  roomEvents: VenueEvent[];
  enterRoom: () => void;
  joinButtonText?: string;
}

export const RoomModalOngoingEvent: React.FunctionComponent<PropsType> = ({
  room,
  roomEvents,
  enterRoom,
  joinButtonText,
}) => {
  const currentEvent = roomEvents && getCurrentEvent(roomEvents);
  const eventToDisplay =
    roomEvents &&
    roomEvents.length > 0 &&
    (currentEvent ? currentEvent : roomEvents[0]);
  const whatsOnText = currentEvent ? "What's on now" : "What's on next";

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
            {whatsOnText}
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
      <a
        className="btn btn-primary room-entry-button"
        onClick={() => enterRoom()}
        id={`enter-room-in-ongoing-event-card-${room.title}`}
        href={room.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {joinButtonText ?? "Join the room"}
      </a>
    </div>
  );
};

export default RoomModalOngoingEvent;
