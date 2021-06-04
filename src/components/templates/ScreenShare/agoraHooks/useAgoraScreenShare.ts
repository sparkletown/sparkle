import { useState, useCallback, useEffect } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

export default function useAgoraScreenShare(
  client: IAgoraRTCClient | undefined
) {
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
  }, [localAudioTrack, localScreenTrack]);

  const joinChannel = async (
    appId: string,
    channel: string,
    token?: string | null
  ) => {
    await client?.join(appId, channel, token || null);
  };

  const leaveChannel = useCallback(async () => {
    stopShare();
    await client?.leave();
  }, [client, stopShare]);

  useEffect(() => {
    return () => {
      leaveChannel();
    };
    // Otherwise, it will fire when local tracks are updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    localScreenTrack,
    shareScreen,
    stopShare,
    joinChannel,
    leaveChannel,
  };
}
