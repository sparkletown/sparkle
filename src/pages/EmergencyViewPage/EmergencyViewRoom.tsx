import React, { useMemo } from "react";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Room } from "types/rooms";

import { useRoom } from "hooks/useRoom";

import { getFirebaseStorageResizedImage } from "../../utils/image";

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
  const roomImage = useMemo(
    () =>
      getFirebaseStorageResizedImage(room.image_url, {
        fit: "crop",
        width: 100,
        height: 100,
      }),
    [room.image_url]
  );

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
          src={roomImage}
          alt={room.title}
        />
        <span>{room.title}</span>
      </div>
    </div>
  );
};

export default EmergencyViewRoom;
