import { useState, useEffect, useCallback } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

export default function useAgoraCamera(
  client: IAgoraRTCClient | undefined
): {
  localCameraTrack: ILocalVideoTrack | undefined;
  remoteUsers: IAgoraRTCRemoteUser[];
  toggleCamera: Function;
  toggleMicrophone: Function;
  isCameraOn: boolean;
} {
  const [localCameraTrack, setLocalCameraTrack] = useState<
    ILocalVideoTrack | undefined
  >(undefined);
  const [localMicrophoneTrack, setLocalMicrophoneTrack] = useState<
    ILocalAudioTrack | undefined
  >(undefined);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

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

  useEffect(() => {
    if (!client) return;
    setRemoteUsers(client.remoteUsers);

    const updateRemoteUsers = () => {
      setRemoteUsers(() => Array.from(client.remoteUsers));
    };

    const handleUserPublished = async (
      user: IAgoraRTCRemoteUser,
      mediaType: "audio" | "video"
    ) => {
      await client.subscribe(user, mediaType);
      updateRemoteUsers();
    };

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", updateRemoteUsers);
    client.on("user-joined", updateRemoteUsers);
    client.on("user-left", updateRemoteUsers);
    onJoin();

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", updateRemoteUsers);
      client.off("user-joined", updateRemoteUsers);
      client.off("user-left", updateRemoteUsers);
      client.leave();
    };
  }, [client, onJoin]);

  return {
    localCameraTrack,
    remoteUsers,
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
  };
}
