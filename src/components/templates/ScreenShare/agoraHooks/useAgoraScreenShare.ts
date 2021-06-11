import { useState, useCallback, useEffect } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import { updateUserIds } from "api/profile";
import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";

export default function useAgoraScreenShare(
  client: IAgoraRTCClient | undefined
) {
  const venueId = useVenueId();
  const { userId } = useUser();
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
    if (!client || !venueId || !userId) return;
    const screenClientUid = await client.join(appId, channel, token || null);
    await updateUserIds({
      venueId,
      userId,
      props: { screenClientUid },
    });
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
