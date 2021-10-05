import React from "react";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Room } from "types/rooms";

import { getFirebaseStorageResizedImage } from "utils/image";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRoom } from "hooks/useRoom";

type EmergencyViewRoomProps = {
  room: Room;
  isLive: boolean;
};

const EmergencyViewRoom: React.FC<EmergencyViewRoomProps> = ({
  room,
  isLive,
}) => {
  const { enterRoom, portalVenueId } = useRoom({ room });

  const { findVenueInRelatedVenues } = useRelatedVenues({});
  const portalVenue = findVenueInRelatedVenues(portalVenueId);

  const roomImage = getFirebaseStorageResizedImage(room.image_url, {
    fit: "crop",
    width: 100,
    height: 100,
  });

  return (
    <div className="EmergencyView__room">
      <div className="EmergencyView__info">
        {isLive && <span className="EmergencyView__info-status">Live</span>}
        <div className="EmergencyView__info-audience">
          <FontAwesomeIcon icon={faUserFriends} size="sm" />
          <span>{portalVenue?.recentUserCount}</span>
        </div>
      </div>
      <div className="EmergencyView__body" onClick={enterRoom}>
        <img
          className="EmergencyView__body-image"
          src={roomImage}
          alt={room.title}
        />
        <span>{room.title}</span>
      </div>
    </div>
  );
};

export default EmergencyViewRoom;
