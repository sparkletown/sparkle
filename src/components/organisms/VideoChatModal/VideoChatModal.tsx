import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router";

import { acceptVideoChat, setVideoChatState } from "api/videoRoom";

import { useConnectVideoRooms } from "hooks/useConnectVideoRooms";
import { useVenueId } from "hooks/useVenueId";
import { useWorldUserById } from "hooks/users";

import { hasElements } from "utils/types";
import { WithId } from "utils/id";

import { VideoChatRequestState } from "types/VideoRoom";
import { User } from "types/User";

import { ConfirmationModal } from "components/atoms/ConfirmationModal/ConfirmationModal";
import { UserAvatar } from "components/atoms/UserAvatar";

import "./VideoChatModal.scss";

export const VideoChatModal: React.FC = () => {
  const videoRoomRequests = useConnectVideoRooms();
  const history = useHistory();
  const venueId = useVenueId();

  const hasVideoRoomRequests = hasElements(videoRoomRequests);

  const currentVideoRoomRequest = useMemo(
    () => (hasVideoRoomRequests ? videoRoomRequests[0] : undefined),
    [hasVideoRoomRequests, videoRoomRequests]
  );

  const host = useWorldUserById(currentVideoRoomRequest?.hostUserId);

  const acceptVideoRoomRequest = useCallback(() => {
    if (!currentVideoRoomRequest || !venueId) return;

    acceptVideoChat(currentVideoRoomRequest.id, venueId);
    history.push(`/pr/${currentVideoRoomRequest.id}`);
  }, [currentVideoRoomRequest, history, venueId]);

  const declineVideoRoomRequest = useCallback(() => {
    if (!currentVideoRoomRequest) return;

    setVideoChatState(
      currentVideoRoomRequest.id,
      VideoChatRequestState.Declined
    );
  }, [currentVideoRoomRequest]);

  if (!currentVideoRoomRequest || !host) {
    return null;
  }

  const hostWithId: WithId<User> = {
    ...host,
    id: currentVideoRoomRequest.hostUserId,
  };

  return (
    <ConfirmationModal
      show={hasVideoRoomRequests}
      message={"wants to video chat with you!"}
      confirmButtonTitle={"Join video chat"}
      cancelButtonTitle={"Decline"}
      onConfirm={acceptVideoRoomRequest}
      onCancel={declineVideoRoomRequest}
    >
      <div className="VideoChatModal__host-info">
        <UserAvatar user={hostWithId} large />
        <div className="VideoChatModal__host-title">{host?.partyName}</div>
      </div>
    </ConfirmationModal>
  );
};
