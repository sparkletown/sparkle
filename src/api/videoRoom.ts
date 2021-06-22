import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { VideoRoomRequest, VideoRoomRequestState } from "types/videoRoom";

export const inviteToVideoChat = async (
  hostUserId: string,
  hostUserLocation: string,
  invitedUserId: string
): Promise<firebase.functions.HttpsCallableResult> => {
  const videoRoomRequest: VideoRoomRequest = {
    hostUserId: hostUserId,
    hostUserLocation: hostUserLocation,
    invitedUserId: invitedUserId,
    invitedUserLocation: "",
    state: VideoRoomRequestState.invited,
    createdAt: (firebase.firestore.FieldValue.serverTimestamp() as unknown) as number,
  };

  return await firebase
    .functions()
    .httpsCallable("videoRoom-addVideoRoomRequest")({
      videoRoomRequest,
    })
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/videoRoom::inviteToVideoChat",
          videoRoomRequest,
        });
      });
      throw err;
    });
};

export const setVideoChatState = async (
  videoChatId: string,
  state: VideoRoomRequestState
): Promise<firebase.functions.HttpsCallableResult> => {
  return await firebase
    .functions()
    .httpsCallable("videoRoom-setVideoChatState")({
      videoChatId,
      state,
    })
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/videoRoom::setVideoChatState",
          videoChatId,
          state,
        });
      });
      throw err;
    });
};

export const acceptVideoChat = async (
  videoChatId: string,
  invitedUserLocation: string
): Promise<firebase.functions.HttpsCallableResult> => {
  return await firebase
    .functions()
    .httpsCallable("videoRoom-acceptVideoRoomRequest")({
      state: VideoRoomRequestState.accepted,
      videoChatId,
      invitedUserLocation,
    })
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/videoRoom::acceptVideoChat",
          videoChatId,
          invitedUserLocation,
        });
      });
      throw err;
    });
};
