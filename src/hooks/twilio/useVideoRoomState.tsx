import { useCallback, useEffect, useMemo, useState } from "react";
import { useAsyncRetry } from "react-use";
import { useVideoComms } from "components/attendee/VideoComms/hooks";
import { VideoCommsStatus } from "components/attendee/VideoComms/types";

import { getUser } from "api/profile";
import { getTwilioVideoToken } from "api/video";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

// import { VideoErrorModal } from "components/organisms/Room/VideoErrorModal";

export const useVideoRoomState = (
  userId: string | undefined,
  roomName?: string | undefined,
  activeParticipantByDefault = true
) => {
  const {
    joinChannel,
    localParticipant,
    remoteParticipants,
    status,
    disconnect,
  } = useVideoComms();

  const [idToUserMap, setIdToUserMap] = useState<
    Record<string, WithId<User> | undefined>
  >({});

  const [videoError, setVideoError] = useState("");
  const dismissVideoError = useCallback(() => setVideoError(""), []);

  const {
    show: becomeActiveParticipant,
    hide: becomePassiveParticipant,
  } = useShowHide(activeParticipantByDefault);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const participants = useMemo(
    () =>
      remoteParticipants.map((remoteParticipant) => {
        if (!(remoteParticipant.sparkleId in idToUserMap)) {
          // Set the user to undefined so that multiple fetches aren't queued
          // at the same time.
          setIdToUserMap((prevIdToUserMap) => {
            return {
              ...prevIdToUserMap,
              [remoteParticipant.sparkleId]: undefined,
            };
          });

          getUser(remoteParticipant.sparkleId).then((user) => {
            setIdToUserMap((prevIdToUserMap) => {
              return { ...prevIdToUserMap, [user.id]: user };
            });
          });
        }
        return {
          user: idToUserMap[remoteParticipant.sparkleId],
          participant: remoteParticipant,
        };
      }),
    [remoteParticipants, idToUserMap]
  );

  const {
    loading: roomLoading,
    retry: retryConnect,
  } = useAsyncRetry(async () => {
    if (!userId || !roomName) return;

    const token = await getTwilioVideoToken({ userId, roomName });
    if (!token) return;

    dismissVideoError();

    try {
      joinChannel({
        userId,
        channelId: roomName,
        enableVideo: true,
        enableAudio: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;

        if (message.toLowerCase().includes("unknown")) {
          setVideoError(
            `${message}; common remedies include closing any other programs using your camera, and giving your browser permission to access the camera.`
          );
        } else setVideoError(message);
      } else {
        setVideoError(`${error}`);
      }
    }
  }, [userId, roomName, dismissVideoError, joinChannel]);

  useEffect(() => () => disconnect(), [disconnect]);

  // const renderErrorModal = useCallback(
  //   (onBack?: () => void) => {
  //     const backHandler = () => {
  //       dismissVideoError();
  //       onBack?.();
  //     };
  //     return (
  //       <VideoErrorModal
  //         show={!!videoError}
  //         onHide={dismissVideoError}
  //         errorMessage={videoError}
  //         onRetry={retryConnect}
  //         onBack={backHandler}
  //       />
  //     );
  //   },
  //   [dismissVideoError, retryConnect, videoError]
  // );
  const renderErrorModal = useCallback(
    (onBack?: () => void) => {
      console.log(videoError, retryConnect);
      return null;
    },
    [retryConnect, videoError]
  );

  return {
    loading: status === VideoCommsStatus.Connecting || roomLoading,

    localParticipant,
    participants,

    renderErrorModal,

    disconnect,
    becomeActiveParticipant,
    becomePassiveParticipant,
  };
};
