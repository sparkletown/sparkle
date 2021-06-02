import React from "react";
import { useParams } from "react-router";

import { useCurrentVideoRoom } from "hooks/useCurrentVideoRoom";
import { useUser } from "hooks/useUser";

import Room from "components/organisms/Room";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import "./VenuePrivateRoom.scss";

export interface VenuePrivateRoomParams {
  roomId: string;
}

export const VenuePrivateRoom: React.FC = () => {
  const { user } = useUser();
  const { roomId } = useParams<VenuePrivateRoomParams>();

  const { videoRoom } = useCurrentVideoRoom(roomId);

  if (!videoRoom) {
    return null;
  }

  const venueId =
    user?.uid === videoRoom.hostUserId
      ? videoRoom.hostUserLocation
      : videoRoom.invitedUserLocation;

  return (
    <WithNavigationBar venueId={venueId}>
      <Room roomName={roomId} />
    </WithNavigationBar>
  );
};
