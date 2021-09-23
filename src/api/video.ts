import { useAsync } from "react-use";
import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

export interface GetTwilioVideoTokenProps {
  userId: string | undefined;
  roomName: string | undefined;
}

export type VideoToken = string;

export const useTwilioVideoToken = ({
  userId,
  roomName,
}: GetTwilioVideoTokenProps) =>
  useAsync(async () => {
    if (!userId || !roomName) return;

    return firebase
      .functions()
      .httpsCallable("video-getTwilioToken")({
        identity: userId,
        room: roomName,
      })
      .then<VideoToken>((res) => res.data.token)
      .catch((err) => {
        Bugsnag.notify(err, (event) => {
          event.addMetadata("context", {
            location: "api/video::getTwilioVideoToken",
            userId,
            roomName,
          });
        });

        throw err;
      });
  });

export interface GetAgoraTokenProps {
  channelName: string;
}

export type AgoraToken = string;

export const getAgoraToken = async ({
  channelName,
}: GetAgoraTokenProps): Promise<AgoraToken> => {
  return firebase
    .functions()
    .httpsCallable("video-getAgoraToken")({
      channelName,
    })
    .then<AgoraToken>((result) => result.data.token)
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/video::getAgoraToken",
          channelName,
        });
      });

      throw err;
    });
};
