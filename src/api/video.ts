import Bugsnag from "@bugsnag/js";
import { FIREBASE } from "core/firebase";
import { httpsCallable } from "firebase/functions";

export interface GetTwilioVideoTokenProps {
  userId: string;
  roomName: string;
}

export interface TwilioRequestVideoTokenProps {
  identity: string;
  room: string;
}

type TwilioResponseProps = {
  token: string;
};

export const getTwilioVideoToken = async ({
  userId,
  roomName,
}: GetTwilioVideoTokenProps) =>
  httpsCallable<TwilioRequestVideoTokenProps, TwilioResponseProps>(
    FIREBASE.functions,
    "video-getTwilioToken"
  )({
    identity: userId,
    room: roomName,
  })
    .then((res) => res.data.token)
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

export interface GetAgoraTokenProps {
  channelName: string;
}

export type AgoraToken = string;
type AgoraResponseProps = {
  token: string;
};

export const getAgoraToken = async ({
  channelName,
}: GetAgoraTokenProps): Promise<AgoraToken> => {
  return httpsCallable<GetAgoraTokenProps, AgoraResponseProps>(
    FIREBASE.functions,
    "video-getAgoraToken"
  )({
    channelName,
  })
    .then<AgoraToken>((res) => res.data.token)
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
