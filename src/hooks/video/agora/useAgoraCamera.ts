import { useCallback, useEffect, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

import { AGORA_APP_ID, AGORA_CHANNEL, AGORA_TOKEN } from "secrets";

import { ReactHook } from "types/utility";

import { updateTalkShowStudioExperience } from "api/profile";

import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

export interface UseAgoraCameraProps {
  venueId?: string;
  userId?: string;
  client?: IAgoraRTCClient;
}
export interface UseAgoraCameraReturn {
  isCameraOn: boolean;
  isMicrophoneOn: boolean;
  localCameraTrack?: ILocalVideoTrack;
  toggleCamera(): void;
  toggleMicrophone(): void;
  joinChannel(): Promise<void>;
  leaveChannel(): Promise<void>;
}

export const useAgoraCamera: ReactHook<
  UseAgoraCameraProps,
  UseAgoraCameraReturn
> = ({ client }) => {
  const { userId } = useUser();
  const venueId = useVenueId();

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

    updateTalkShowStudioExperience({ venueId, userId, experience });

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

    await client?.leave();
  }, [client, localCameraTrack, localMicrophoneTrack]);

  useEffect(() => {
    return () => {
      leaveChannel();
    };
    // Otherwise, it will fire when local tracks are updated
    // @debt We shouldn't be disabling our linting rules like this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    localCameraTrack,
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
    isMicrophoneOn,
    joinChannel,
    leaveChannel,
  };
};
