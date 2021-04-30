import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

export interface GetVideoTokenProps {
  userId: string;
  roomName: string;
}

export const getVideoToken = async ({
  userId,
  roomName,
}: GetVideoTokenProps): Promise<void | firebase.functions.HttpsCallableResult> => {
  return firebase
    .functions()
    .httpsCallable("video-getToken")({
      identity: userId,
      room: roomName,
    })
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/video::getVideoToken",
          userId,
          roomName,
        });
      });
    });
};
