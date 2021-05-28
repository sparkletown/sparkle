import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router";

import { setVideoChatState } from "api/video";

import { useConnectVideoRooms } from "hooks/useConnectVideoRooms";
import { useVenueId } from "hooks/useVenueId";

import { hasElements } from "utils/types";

import { VideoChatRequestState } from "types/VideoRoom";

import { ConfirmationModal } from "components/atoms/ConfirmationModal/ConfirmationModal";

export const VideoChatModal: React.FC = () => {
  const videoRoomRequests = useConnectVideoRooms();
  const venueId = useVenueId();
  const history = useHistory();

  const hasVideoRoomRequests = hasElements(videoRoomRequests);

  const currentVideoRoomRequest = videoRoomRequests?.[0] ?? {};

  useEffect(() => {
    console.log(videoRoomRequests, hasVideoRoomRequests);
  }, [videoRoomRequests, hasVideoRoomRequests]);

  const acceptVideoRoomRequest = useCallback(() => {
    setVideoChatState(
      currentVideoRoomRequest.id,
      VideoChatRequestState.Accepted
    );
    history.push(`/pr/${venueId}/${currentVideoRoomRequest.id}`);
  }, [currentVideoRoomRequest.id, history, venueId]);

  const declineVideoRoomRequest = useCallback(() => {
    setVideoChatState(
      currentVideoRoomRequest.id,
      VideoChatRequestState.Declined
    );
    history.push(`/pr/${venueId}/${currentVideoRoomRequest.id}`);
  }, [currentVideoRoomRequest.id, history, venueId]);

  console.log("VideoChatModal:", videoRoomRequests);

  if (!hasVideoRoomRequests) {
    return null;
  }

  return (
    <ConfirmationModal
      message={`test`}
      onConfirm={acceptVideoRoomRequest}
      onCancel={declineVideoRoomRequest}
    />
  );
};
