import React from "react";
import { RoomAttendance } from "./RoomAttendance";
import { formatUtcSeconds } from "utils/time";
import { CampRoomData } from "types/CampRoomData";
import { useSelector } from "hooks/useSelector";
import { getCurrentEvent } from "utils/event";
import "../../../templates/PartyMap/components/RoomCard/RoomCard.scss";

interface PropsType {
  room: CampRoomData;
  attendance?: number;
  onClick: () => void;
}

const RoomCard: React.FunctionComponent<PropsType> = ({
  room,
  attendance,
  onClick,
}) => {
  const venueEvents = useSelector(
    (state) => state.firestore.ordered.venueEvents
  );

  if (!venueEvents || !room.isEnabled) return null;

  const roomEvents = venueEvents.filter((event) => event.room === room.title);
  const currentEvent = roomEvents && getCurrentEvent(roomEvents);

  const eventToDisplay =
    roomEvents &&
    roomEvents.length > 0 &&
    (currentEvent ? currentEvent : roomEvents[0]);

  return (
    <div
      className="card card_room"
      onClick={onClick}
      id={`room-card-${room.title}`}
    >
      <div>
        <span className="icon-1"></span>
        <span className="icon-2"></span>
        <span className="icon-3"></span>
      </div>
      {room.image_url && (
        <img src={room.image_url} className="card_room-pic" alt={room.title} />
      )}
      <h5 className="italic">{room.title}</h5>
      <div className="room-attendance-container">
        <RoomAttendance roomTitle={room.title} attendance={attendance} />
      </div>
      <div className="card_room-now">
        {eventToDisplay && (
          <>
            <h6 className="primary">{eventToDisplay.name}</h6>
            <p className="small primary">by {eventToDisplay.host}</p>
            <p className="small primary">
              {formatUtcSeconds(eventToDisplay?.start_utc_seconds)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
