import firebase from "firebase/app";

import { VideoChatRequest, VideoChatRequestState } from "types/VideoRoom";

export const inviteToVideoChat = async (
  hostUserId: string,
  hostUserLocation: string,
  invitedUserId: string
) => {
  const videoRoomRequest: VideoChatRequest = {
    hostUserId: hostUserId,
    hostUserLocation: hostUserLocation,
    invitedUserId: invitedUserId,
    invitedUserLocation: "",
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

export const acceptVideoChat = async (
  videoChatId: string,
  invitedUserLocation: string
) => {
  return await firebase
    .functions()
    .httpsCallable("videoRoom-acceptVideoRoomRequest")({
    state: VideoChatRequestState.Accepted,
    videoChatId,
    invitedUserLocation,
  });
};
