import React from "react";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Room } from "types/rooms";

import { useRoom } from "hooks/useRoom";

type EmergencyViewRoomProps = {
  room: Room;
  venueName: string;
  isLive: boolean;
};

const EmergencyViewRoom: React.FC<EmergencyViewRoomProps> = ({
  room,
  venueName,
  isLive,
}) => {
  const { enterRoom, recentRoomUsers } = useRoom({ room, venueName });

  return (
    <div className="EmergencyView_content_room">
      <div className="EmergencyView_content_room_info">
        {isLive && (
          <span className="EmergencyView_content_room_info_status">Live</span>
        )}
        <div className="EmergencyView_content_room_info_audience">
          <FontAwesomeIcon icon={faUserFriends} size="sm" />
          <span>{recentRoomUsers.length}</span>
        </div>
      </div>
      <div className="EmergencyView_content_room_body" onClick={enterRoom}>
        <img
          className="EmergencyView_content_room_body_image"
          src={room.image_url}
          alt={room.title}
        />
        <span>{room.title}</span>
      </div>
    </div>
  );
};

export default EmergencyViewRoom;
