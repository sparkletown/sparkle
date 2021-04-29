import { useCallback, useEffect, useState } from "react";
import Video, {
  LocalVideoTrack,
  LocalParticipant,
  RemoteParticipant,
} from "twilio-video";

import { getVideoToken } from "api/video";

export interface UseVideoRoomProps {
  userId?: string;
  roomName?: string;
}

export const useVideoRoom = ({ userId, roomName }: UseVideoRoomProps) => {
  const [token, setToken] = useState<string>();

  useEffect(() => {
    (async () => {
      if (!userId || !!token || !roomName) return;

      const response = await getVideoToken({
        userId,
        roomName,
      });

      setToken(response.data.token);
    })();
  }, [userId, roomName, token]);

  const [room, setRoom] = useState<Video.Room>();
  const [participants, setParticipants] = useState<
    (LocalParticipant | RemoteParticipant)[]
  >([]);

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

  const [hasVideo, setHasVideo] = useState(false);

  const turnVideoOn = () => {
    setHasVideo(true);
  };

  const turnVideoOff = () => {
    setHasVideo(false);
  };

  const localParticipant = room?.localParticipant;

  useEffect(() => {
    if (!localParticipant) return;

    setParticipants((prevParticipants) => [
      // Hopefully prevents duplicate users in the participant list
      ...prevParticipants.filter(
        (p) => p.identity !== localParticipant.identity
      ),
      localParticipant,
    ]);
  }, [localParticipant]);

  useEffect(() => {
    if (!token || !roomName) return;

    const participantConnected = (participant: RemoteParticipant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant: RemoteParticipant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };
    // https://media.twiliocdn.com/sdk/js/video/releases/2.7.1/docs/global.html#ConnectOptions
    Video.connect(token, {
      name: roomName,
      video: hasVideo,
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
  }, [disconnect, roomName, token, hasVideo]);

  return {
    token,

    room,
    participants,

    disconnect,
    turnVideoOff,
    turnVideoOn,
  };
};
