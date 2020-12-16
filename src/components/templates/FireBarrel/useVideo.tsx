import { useCallback, useEffect, useState } from "react";
import Video, { LocalVideoTrack } from "twilio-video";
import firebase from "firebase/app";

export interface UseVideoStateProps {
  userUid?: string;
  roomName?: string;
}

export const useVideoState = ({ userUid, roomName }: UseVideoStateProps) => {
  const [token, setToken] = useState<string>();

  useEffect(() => {
    (async () => {
      if (!userUid || !!token) return;

      const getToken = firebase.functions().httpsCallable("video-getToken");

      const response = await getToken({
        identity: userUid,
        room: roomName,
      });

      setToken(response.data.token);
    })();
  }, [userUid, roomName, token]);

  const [room, setRoom] = useState<Video.Room>();
  const [participants, setParticipants] = useState<Video.Participant[]>([]);

  const disconnect = useCallback(() => {
    setRoom((currentRoom) => {
      if (currentRoom && currentRoom.localParticipant.state === "connected") {
        currentRoom.localParticipant.tracks.forEach((trackPublication) => {
          (trackPublication.track as LocalVideoTrack).stop();
        });
        currentRoom.disconnect();
        return undefined;
      } else {
        return currentRoom;
      }
    });
  }, []);

  useEffect(() => {
    if (!token || !roomName) return;

    const participantConnected = (participant: Video.Participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant: Video.Participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };
    // https://media.twiliocdn.com/sdk/js/video/releases/2.7.1/docs/global.html#ConnectOptions
    Video.connect(token, {
      name: roomName,
      enableDscp: true,
    }).then((room) => {
      setRoom(room);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      disconnect();
    };
  }, [disconnect, roomName, token]);

  return {
    token,
    roomName,
    room,
    participants,
    disconnect,
  };
};
