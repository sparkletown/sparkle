import { useState, useEffect, useCallback } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

export default function useAgoraCamera(client: IAgoraRTCClient | undefined) {
  const [localCameraTrack, setLocalCameraTrack] = useState<
    ILocalVideoTrack | undefined
  >(undefined);
  const [localMicrophoneTrack, setLocalMicrophoneTrack] = useState<
    ILocalAudioTrack | undefined
  >(undefined);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);

  const toggleCamera = () => {
    localCameraTrack?.setEnabled(!isCameraOn);
    setIsCameraOn(!isCameraOn);
  };

  const toggleMicrophone = () => {
    localMicrophoneTrack?.setEnabled(!isMicrophoneOn);
    setIsMicrophoneOn(!isMicrophoneOn);
  };

  const joinChannel = async (
    appId: string,
    channel: string,
    token?: string | null
  ) => {
    if (!client) return;
    await client.join(appId, channel, token || null);

    setIsCameraOn(true);
    setIsMicrophoneOn(true);
    const cameraTrack = await AgoraRTC.createCameraVideoTrack();
    const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();

    setLocalCameraTrack(cameraTrack);
    setLocalMicrophoneTrack(microphoneTrack);
    await client.publish([microphoneTrack, cameraTrack]);
  };

  const leaveChannel = useCallback(async () => {
    if (localCameraTrack) {
      localCameraTrack.stop();
      localCameraTrack.close();
    }

    if (localMicrophoneTrack) {
      localMicrophoneTrack.stop();
      localMicrophoneTrack.close();
    }

    setLocalCameraTrack(undefined);
    setLocalMicrophoneTrack(undefined);

    await client?.leave();
  }, [client, localCameraTrack, localMicrophoneTrack]);

  useEffect(() => {
    return () => {
      leaveChannel();
    };
    // Otherwise, it will fire when local tracks are updated
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
}
