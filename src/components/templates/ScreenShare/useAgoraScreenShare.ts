import { useState, useCallback, useEffect } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

export default function useAgoraScreenShare(
  client: IAgoraRTCClient | undefined
): {
  localScreenTrack: ILocalVideoTrack | undefined;
  shareScreen: Function;
  stopShare: Function;
} {
  const [localScreenTrack, setLocalScreenTrack] = useState<
    ILocalVideoTrack | undefined
  >(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState<
    ILocalAudioTrack | undefined
  >(undefined);

  const shareScreen = useCallback(async () => {
    if (!client) return;

    const screenTrack = await AgoraRTC.createScreenVideoTrack({}, "auto");

    if (Array.isArray(screenTrack)) {
      const [screenVideoTrack, screenAudioTrack] = screenTrack;
      setLocalScreenTrack(screenVideoTrack);
      setLocalAudioTrack(screenAudioTrack);
      await client.publish(screenVideoTrack);
      await client.publish(screenAudioTrack);
      return;
    }

    setLocalScreenTrack(screenTrack);
    await client.publish(screenTrack);
  }, [client]);

  const stopShare = useCallback(() => {
    if (!client) return;

    if (localScreenTrack) {
      localScreenTrack.stop();
      localScreenTrack.close();
    }

    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }

    setLocalScreenTrack(undefined);
    setLocalAudioTrack(undefined);
  }, [client, localAudioTrack, localScreenTrack]);

  useEffect(() => {
    if (!client) return;
    client.join("bc9f5ed85b4f4218bff32c78a3ff88eb", "videotest", null);
    return () => {
      client.leave();
    };
  }, [client]);

  return {
    localScreenTrack,
    shareScreen,
    stopShare,
  };
}
