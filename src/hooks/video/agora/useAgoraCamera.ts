import { useCallback, useEffect, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

import { AGORA_APP_ID, AGORA_CHANNEL, AGORA_TOKEN } from "secrets";

import { UseAgoraCameraReturn } from "types/agora";

import { updateTalkShowStudioExperience } from "api/profile";

import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

export const useAgoraCamera = (): UseAgoraCameraReturn => {
  const { userId } = useUser();
  const venueId = useVenueId();

  const [client, setClient] = useState<IAgoraRTCClient>();
  const [localCameraTrack, setLocalCameraTrack] = useState<ILocalVideoTrack>();
  const [
    localMicrophoneTrack,
    setLocalMicrophoneTrack,
  ] = useState<ILocalAudioTrack>();
  const { isShown: isCameraOn, setShown: setIsCameraOn } = useShowHide();
  const {
    isShown: isMicrophoneOn,
    setShown: setIsMicrophoneOn,
  } = useShowHide();

  const toggleCamera = () => {
    localCameraTrack?.setEnabled(!isCameraOn);
    setIsCameraOn(!isCameraOn);
  };

  const toggleMicrophone = () => {
    localMicrophoneTrack?.setEnabled(!isMicrophoneOn);
    setIsMicrophoneOn(!isMicrophoneOn);
  };

  const joinChannel = async () => {
    if (!client || !venueId || !userId) return;

    const cameraClientUid = await client.join(
      AGORA_APP_ID || "",
      AGORA_CHANNEL || "",
      AGORA_TOKEN || null
    );

    const experience = {
      cameraClientUid: `${cameraClientUid}`,
    };

    await updateTalkShowStudioExperience({ venueId, userId, experience });

    setIsCameraOn(true);
    setIsMicrophoneOn(true);
    const cameraTrack = await AgoraRTC.createCameraVideoTrack();
    const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();

    setLocalCameraTrack(cameraTrack);
    setLocalMicrophoneTrack(microphoneTrack);
    await client.publish([microphoneTrack, cameraTrack]);
  };

  const leaveChannel = useCallback(async () => {
    localCameraTrack?.stop();
    localCameraTrack?.close();

    localMicrophoneTrack?.stop();
    localMicrophoneTrack?.close();

    setLocalCameraTrack(undefined);
    setLocalMicrophoneTrack(undefined);

    await client?.unpublish();
    await client?.leave();
  }, [client, localCameraTrack, localMicrophoneTrack]);

  useEffect(() => {
    setClient(
      AgoraRTC.createClient({
        codec: "h264",
        mode: "rtc",
      })
    );

    return () => {
      leaveChannel();
      setClient(undefined);
    };
    // Otherwise, it will fire when local tracks are updated
    // @debt We shouldn't be disabling our linting rules like this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    client,
    localCameraTrack,
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
    isMicrophoneOn,
    joinChannel,
    leaveChannel,
  };
};
