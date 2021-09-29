import { useCallback, useEffect, useState } from "react";
import { useAsync } from "react-use";
import {
  connect,
  LocalParticipant,
  LocalVideoTrack,
  RemoteParticipant,
  Room,
} from "twilio-video";

import { getUser } from "api/profile";
import { useTwilioVideoToken } from "api/video";

import { ParticipantWithUser } from "types/rooms";
import { User } from "types/User";

import { WithId } from "utils/id";
import { logIfCannotFindExistingParticipant } from "utils/room";

import { useShowHide } from "hooks/useShowHide";

export const useVideoRoomState = (
  user: WithId<User> | undefined,
  roomName?: string | undefined,
  activeParticipantByDefault = true
) => {
  const { value: token } = useTwilioVideoToken({ userId: user?.id, roomName });

  const [room, setRoom] = useState<Room>();
  const [participants, setParticipants] = useState<
    ParticipantWithUser<LocalParticipant | RemoteParticipant>[]
  >([]);

  const disconnect = useCallback(() => {
    setRoom((currentRoom) => {
      if (currentRoom?.localParticipant?.state !== "connected")
        return currentRoom;

      currentRoom.localParticipant.tracks.forEach((trackPublication) => {
        (trackPublication.track as LocalVideoTrack).stop();
      });

      currentRoom.disconnect();

      return undefined;
    });
  }, []);

  const {
    isShown: isActiveParticipant,

    show: becomeActiveParticipant,
    hide: becomePassiveParticipant,
  } = useShowHide(activeParticipantByDefault);

  const participantConnected = useCallback(
    async (participant: RemoteParticipant | LocalParticipant) => {
      const user = await getUser(participant.identity);

      setParticipants((prevParticipants) => [
        ...prevParticipants,
        {
          participant: participant,
          user,
        },
      ]);
    },
    []
  );

  const participantDisconnected = useCallback(
    (participant: RemoteParticipant) => {
      setParticipants((prevParticipants) => {
        logIfCannotFindExistingParticipant(prevParticipants, participant);
        return prevParticipants.filter(
          (p) => p.participant.identity !== participant.identity
        );
      });
    },
    []
  );

  const { loading: roomLoading } = useAsync(async () => {
    if (!token || !roomName) return;

    // https://media.twiliocdn.com/sdk/js/video/releases/2.7.1/docs/global.html#ConnectOptions
    await connect(token, {
      name: roomName,
      video: isActiveParticipant,
      audio: isActiveParticipant,
      enableDscp: true,
    }).then(setRoom);
  }, [roomName, token, isActiveParticipant]);

  useEffect(() => () => disconnect(), [disconnect]);

  const { loading: participantsLoading } = useAsync(async () => {
    if (!room || !user) return;

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);

    [room.localParticipant, ...room.participants.values()].forEach(
      participantConnected
    );

    // Do we need `.off`? It looks like it's not in the docs
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room, user, participantConnected, participantDisconnected]);

  return {
    token,

    room,
    participants,
    roomLoading: participantsLoading || roomLoading,

    disconnect,
    becomeActiveParticipant,
    becomePassiveParticipant,
  };
};
