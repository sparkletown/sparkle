import React from "react";
import "./RoomCard.scss";
import RoomAttendance from "../RoomAttendance";
import { formatMinute } from "utils/time";
import { WithId } from "utils/id";
import { SubVenue, PartyMapScheduleItem } from "types/PartyMapVenue";
import { Venue } from "types/Venue";

interface PropsType {
  startUtcSeconds: number;
  subVenue: WithId<SubVenue>;
  childVenue?: WithId<Venue>;
  displayedEvent?: PartyMapScheduleItem;
  attendance?: number;
  onClick: () => void;
}

const RoomCard: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  subVenue,
  childVenue,
  displayedEvent,
  attendance,
  onClick,
}) => {
  return (
    <div
      className="card card_room"
      onClick={onClick}
      id={`room-card-${subVenue.id}`}
    >
      <div className="card-animation card-animation_music">
        <span className="icon-1"></span>
        <span className="icon-2"></span>
        <span className="icon-3"></span>
      </div>
      {childVenue?.mapIconImageUrl && (
        <img
          src={childVenue.mapIconImageUrl}
          className="card_room-pic"
          alt={subVenue.id}
        />
      )}
      <h5 className="italic">{subVenue.id}</h5>
      <div className="room-attendance-container">
        <RoomAttendance room={subVenue} attendance={attendance} />
      </div>
      {displayedEvent && (
        <div className="card_room-now">
          <h6 className="primary">{displayedEvent.name}</h6>
          <p className="small primary">by {displayedEvent.host}</p>
          <p className="small primary">
            {formatMinute(displayedEvent.start_minute, startUtcSeconds)}
          </p>
        </div>
      )}
    </div>
  );
};

export default RoomCard;
