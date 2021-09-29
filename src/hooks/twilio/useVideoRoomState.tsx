import React, { useCallback, useEffect, useState } from "react";
import { useAsync, useAsyncRetry } from "react-use";
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

import VideoErrorModal from "components/organisms/Room/VideoErrorModal";

export const useVideoRoomState = (
  user: WithId<User> | undefined,
  roomName?: string | undefined,
  activeParticipantByDefault = true
) => {
  const { value: token } = useTwilioVideoToken({ userId: user?.id, roomName });

  const [room, setRoom] = useState<Room>();
  const [videoError, setVideoError] = useState("");
  const dismissVideoError = useCallback(() => setVideoError(""), []);
  const [localParticipant, setLocalParticipant] = useState<LocalParticipant>();
  const [participants, setParticipants] = useState<
    ParticipantWithUser<RemoteParticipant>[]
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
    async (participant: RemoteParticipant) => {
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

  const {
    loading: roomLoading,
    retry: retryConnect,
  } = useAsyncRetry(async () => {
    if (!token || !roomName) return;
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
  }, [token, roomName, dismissVideoError, isActiveParticipant]);

  useEffect(() => () => disconnect(), [disconnect]);

  const { loading: participantsLoading } = useAsync(async () => {
    if (!room || !user) return;

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);

    setLocalParticipant(room.localParticipant);
    [...room.participants.values()].forEach(participantConnected);

    return () => {
      setLocalParticipant(undefined);
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room, user, participantConnected, participantDisconnected]);

  const renderErrorModal = useCallback(
    (onBack: (dismissError: () => void) => void) => {
      const backHandler = () => {
        onBack(dismissVideoError);
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

    renderErrorModal,

    disconnect,
    becomeActiveParticipant,
    becomePassiveParticipant,
  };
};
