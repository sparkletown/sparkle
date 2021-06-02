import { useState, useEffect, useCallback } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

export default function useAgoraCamera(
  client: IAgoraRTCClient | undefined
): {
  localCameraTrack: ILocalVideoTrack | undefined;
  toggleCamera: () => void;
  toggleMicrophone: () => void;
  isCameraOn: boolean;
  closeTracks: () => void;
  isMicrophoneOn: boolean;
} {
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

  const onJoin = useCallback(async () => {
    if (!client) return;
    await client.join("bc9f5ed85b4f4218bff32c78a3ff88eb", "videotest", null);

    setIsCameraOn(true);
    setIsMicrophoneOn(true);
    const cameraTrack = await AgoraRTC.createCameraVideoTrack();
    const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();

    setLocalCameraTrack(cameraTrack);
    setLocalMicrophoneTrack(microphoneTrack);
    await client.publish([microphoneTrack, cameraTrack]);
  }, [client]);

  const closeTracks = () => {
    if (!client) return;

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
  };

  useEffect(() => {
    if (!client) return;
    onJoin();

    return () => {
      client.leave();
    };
  }, [client, onJoin]);

  return {
    localCameraTrack,
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
    closeTracks,
    isMicrophoneOn,
  };
}
