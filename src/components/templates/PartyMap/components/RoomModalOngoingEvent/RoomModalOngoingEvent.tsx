import React from "react";
import "./RoomModalOngoingEvent.scss";
import { Venue } from "types/Venue";
import { PartyMapScheduleItem } from "types/PartyMapVenue";

interface PropsType {
  venue: Venue;
  displayedEvent: PartyMapScheduleItem | false;
  enterRoom: () => void;
  startUtcSeconds: number;
}

const RoomModalOngoingEvent: React.FunctionComponent<PropsType> = ({
  venue,
  displayedEvent,
  enterRoom,
  startUtcSeconds,
}) => {
  return (
    <div className="room-modal-ongoing-event-container">
      {displayedEvent && (
        <>
          <div className="title-container">
            <img
              src="/sparkle-icon.png"
              className="sparkle-icon"
              alt="sparkle-icon"
            />
            {`What's on now`}
          </div>
          <div className="artist-ongoing-container">
            <div className="event-title">{displayedEvent.name}</div>
            <div>
              by <span className="artist-name">{displayedEvent.host}</span>
            </div>
          </div>
          <div className="event-description">
            {(displayedEvent.text || "").split("\n").map((p: any) => (
              <p>{p}</p>
            ))}
          </div>
          <a
            className="btn btn-primary room-entry-button"
            onClick={() => enterRoom()}
            id={`enter-room-in-ongoing-event-card-${venue.name}`}
            href={"createVenueUrl(venue)"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join the room
          </a>
        </>
      )}
    </div>
  );
};

export default RoomModalOngoingEvent;
