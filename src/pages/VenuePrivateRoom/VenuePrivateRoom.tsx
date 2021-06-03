import React, { useCallback } from "react";
import { useParams } from "react-router";

import { useCurrentVideoRoom } from "hooks/useCurrentVideoRoom";
import { useUser } from "hooks/useUser";

import { VideoChatRequestState } from "types/VideoRoom";

import { enterVenue } from "utils/url";

import Room from "components/organisms/Room";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { NotificationModal } from "components/atoms/NotificationModal";

import "./VenuePrivateRoom.scss";

export interface VenuePrivateRoomParams {
  roomId: string;
}

export const VenuePrivateRoom: React.FC = () => {
  const { user } = useUser();
  const { roomId } = useParams<VenuePrivateRoomParams>();
  const { videoRoom } = useCurrentVideoRoom(roomId);

  const venueId =
    user?.uid === videoRoom?.hostUserId
      ? videoRoom?.hostUserLocation
      : videoRoom?.invitedUserLocation;

  const navigateToVenue = useCallback(() => {
    if (!venueId || !videoRoom) return;

    enterVenue(venueId);
  }, [venueId, videoRoom]);

  if (!videoRoom) {
    return null;
  }

  const isInviteDeclined = videoRoom.state === VideoChatRequestState.Declined;

  return (
    <WithNavigationBar venueId={venueId}>
      <Room roomName={roomId} />
      {isInviteDeclined && (
        <NotificationModal
          message={"Your video chat request was declined. "}
          buttonTitle={`Back to ${venueId}`}
          onConfirm={navigateToVenue}
        />
      )}
    </WithNavigationBar>
  );
};
