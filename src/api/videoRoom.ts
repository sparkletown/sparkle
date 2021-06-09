import Bugsnag from "@bugsnag/js";
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
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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
      return err;
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
    })
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/videoRoom::setVideoChatState",
          videoChatId,
          state,
        });
      });
      return err;
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
    })
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/videoRoom::acceptVideoChat",
          videoChatId,
          invitedUserLocation,
        });
      });
      return err;
    });
};
