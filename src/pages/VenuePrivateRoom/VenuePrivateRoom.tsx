import React from "react";
import { useParams } from "react-router";

import Room from "components/organisms/Room";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import "./VenuePrivateRoom.scss";

export interface VenuePrivateRoomParams {
  venueId: string;
  roomId: string;
}

export const VenuePrivateRoom: React.FC = () => {
  const { venueId, roomId } = useParams<VenuePrivateRoomParams>();

  return (
    <WithNavigationBar>
      <Room roomName={roomId} venueName={venueId} setUserList={() => {}} />
    </WithNavigationBar>
  );
};
