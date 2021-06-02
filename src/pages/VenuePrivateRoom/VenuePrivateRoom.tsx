import React from "react";
import { useParams } from "react-router";

import { useCurrentVideoRoom } from "hooks/useCurrentVideoRoom";

import Room from "components/organisms/Room";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { LoadingPage } from "components/molecules/LoadingPage";

import "./VenuePrivateRoom.scss";

export interface VenuePrivateRoomParams {
  roomId: string;
}

export const VenuePrivateRoom: React.FC = () => {
  const { roomId } = useParams<VenuePrivateRoomParams>();

  const { videoRoom, isLoading } = useCurrentVideoRoom(roomId);

  console.log(videoRoom, isLoading);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!videoRoom && !isLoading) {
    return <div>failed</div>;
  }

  return (
    <WithNavigationBar venueId={"denismusic"}>
      <Room roomName={roomId} />
    </WithNavigationBar>
  );
};
