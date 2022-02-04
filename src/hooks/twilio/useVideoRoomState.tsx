import React, { useCallback, useEffect, useState } from "react";
import { useAsync, useAsyncRetry, useList } from "react-use";
import {
  connect,
  LocalParticipant,
  LocalVideoTrack,
  RemoteParticipant,
  Room,
} from "twilio-video";

import { getUser } from "api/profile";
import { getTwilioVideoToken } from "api/video";

import { ParticipantWithUser } from "types/rooms";

import { useShowHide } from "hooks/useShowHide";

import { VideoErrorModal } from "components/organisms/Room/VideoErrorModal";

export const useVideoRoomState = (
  userId: string | undefined,
  roomName?: string | undefined,
  activeParticipantByDefault = true
) => {
  const [room, setRoom] = useState<Room>();

  const [videoError, setVideoError] = useState("");
  const dismissVideoError = useCallback(() => setVideoError(""), []);

  const hasRoom = room !== undefined;

  const [localParticipant, setLocalParticipant] = useState<LocalParticipant>();
  const [
    participants,
    { upsert: upsertParticipant, filter: filterParticipants },
  ] = useList<ParticipantWithUser<RemoteParticipant>>([]);

  const {
    isShown: isActiveParticipant,

    show: becomeActiveParticipant,
    hide: becomePassiveParticipant,
  } = useShowHide(activeParticipantByDefault);

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

  const participantConnected = useCallback(
    async (participant: RemoteParticipant) => {
      const user = await getUser(participant.identity);
      upsertParticipant(
        (existing) => existing.participant.identity === participant.identity,
        {
          participant: participant,
          user,
        }
      );
    },
    [upsertParticipant]
  );

  const participantDisconnected = useCallback(
    (participant: RemoteParticipant) => {
      filterParticipants(
        (existing) => existing.participant.identity !== participant.identity
      );
    },
    [filterParticipants]
  );

  const {
    loading: roomLoading,
    retry: retryConnect,
  } = useAsyncRetry(async () => {
    if (!userId || !roomName) return;

    const token = await getTwilioVideoToken({ userId, roomName });
    if (!token) return;

    dismissVideoError();

    // https://media.twiliocdn.com/sdk/js/video/releases/2.7.1/docs/global.html#ConnectOptions
    await connect(token, {
      name: roomName,
      video: isActiveParticipant,
      audio: isActiveParticipant,
      enableDscp: true,
    })
      .then(setRoom)
      .catch((error) => {
        const message = error.message;

        if (message.toLowerCase().includes("unknown")) {
          setVideoError(
            `${message}; common remedies include closing any other programs using your camera, and giving your browser permission to access the camera.`
          );
        } else setVideoError(message);
      });
  }, [userId, roomName, dismissVideoError, isActiveParticipant]);

  useEffect(() => () => disconnect(), [disconnect]);

  const { loading: participantsLoading } = useAsync(async () => {
    if (!room) return;

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);

    setLocalParticipant(room.localParticipant);
    [...room.participants.values()].forEach(participantConnected);

    return () => {
      setLocalParticipant(undefined);
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room, participantConnected, participantDisconnected]);

  const renderErrorModal = useCallback(
    (onBack?: () => void) => {
      const backHandler = () => {
        dismissVideoError();
        onBack?.();
      };
      return (
        <VideoErrorModal
          show={!!videoError}
          onHide={dismissVideoError}
          errorMessage={videoError}
          onRetry={retryConnect}
          onBack={backHandler}
        />
      );
    },
    [dismissVideoError, retryConnect, videoError]
  );

  return {
    loading: participantsLoading || roomLoading,

    localParticipant,
    participants,

    hasRoom,

    renderErrorModal,

    retryConnect,
    disconnect,
    becomeActiveParticipant,
    becomePassiveParticipant,
  };
};
