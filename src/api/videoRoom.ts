import firebase from "firebase/app";

import { VideoChatRequest, VideoChatRequestState } from "types/VideoRoom";

export const inviteToVideoChat = async (
  hostUserId: string,
  guestId: string
) => {
  const videoRoomRequest: VideoChatRequest = {
    hostUserId: hostUserId,
    hostUserLocation: "123",
    invitedUserIds: [{ id: guestId, location: "asd" }],
    state: VideoChatRequestState.Invited,
    createdAt: Date.now(),
  };

  return await firebase
    .functions()
    .httpsCallable("videoRoom-addVideoRoomRequest")({
    videoRoomRequest,
  });
};

export const setVideoChatState = async (
  videoChatId: string,
  state: VideoChatRequestState
) => {
  return await firebase
    .functions()
    .httpsCallable("videoRoom-setVideoChatState")({
    videoChatId,
    state,
  });
};
