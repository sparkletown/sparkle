import firebase from "firebase/app";

export interface GetVideoTokenProps {
  userId: string;
  roomName: string;
}

export const getVideoToken = async ({
  userId,
  roomName,
}: GetVideoTokenProps) => {
  return firebase.functions().httpsCallable("video-getToken")({
    identity: userId,
    room: roomName,
  });
};
