import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router";
import { useAsync } from "react-use";

import { getUserById } from "api/profile";
import { acceptVideoChat, setVideoChatState } from "api/videoRoom";

import { useConnectVideoRooms } from "hooks/useConnectVideoRooms";
import { useVenueId } from "hooks/useVenueId";

import { hasElements } from "utils/types";

import { VideoChatRequestState } from "types/VideoRoom";

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

  const { value: host } = useAsync(
    async () => await getUserById(currentVideoRoomRequest?.hostUserId)
  );

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

  if (!hasVideoRoomRequests) {
    return null;
  }

  return (
    <ConfirmationModal
      show={hasVideoRoomRequests}
      message={"wants to video chat with you!"}
      confirmButtonTitle={"Join video chat"}
      cancelButtonTitle={"Decline"}
      onConfirm={acceptVideoRoomRequest}
      onCancel={declineVideoRoomRequest}
    >
      <div className="row">
        <UserAvatar user={host} large />
        <div>{host?.partyName}</div>
      </div>
    </ConfirmationModal>
  );
};
