import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { VideoChatRequest, VideoChatRequestState } from "types/VideoRoom";

export interface GetVideoTokenProps {
  userId: string;
  roomName: string;
  onError?: (msg: string) => void;
  onFinish?: () => void;
}

export type VideoToken = string;

export const getVideoToken = async ({
  userId,
  roomName,
  onError,
  onFinish,
}: GetVideoTokenProps): Promise<void | VideoToken> => {
  return firebase
    .functions()
    .httpsCallable("video-getToken")({
      identity: userId,
      room: roomName,
    })
    .then<VideoToken>((res) => res.data.token)
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/video::getVideoToken",
          userId,
          roomName,
        });
      });

      if (onError) onError(err);
    })
    .finally(onFinish);
};

export const inviteToVideoChat = async (
  hostUserId: string,
  guestId: string
) => {
  const videoRoomRequest: VideoChatRequest = {
    hostUserId: hostUserId,
    invitedUserIds: [guestId],
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
