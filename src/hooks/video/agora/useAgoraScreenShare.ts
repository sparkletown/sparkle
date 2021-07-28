import { useCallback, useEffect, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

import { AGORA_APP_ID, AGORA_CHANNEL, AGORA_TOKEN } from "secrets";

import { UseAgoraScreenShareReturn } from "types/agora";

import { updateTalkShowStudioExperience } from "api/profile";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

export const useAgoraScreenShare = (): UseAgoraScreenShareReturn => {
  const { userId } = useUser();
  const venueId = useVenueId();

  const [client, setClient] = useState<IAgoraRTCClient>();
  const [localScreenTrack, setLocalScreenTrack] = useState<ILocalVideoTrack>();
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack>();

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

  const stopShare = useCallback(async () => {
    localScreenTrack?.stop();
    localScreenTrack?.close();

    localAudioTrack?.stop();
    localAudioTrack?.close();

    await client?.unpublish();

    setLocalScreenTrack(undefined);
    setLocalAudioTrack(undefined);
  }, [client, localAudioTrack, localScreenTrack]);

  const joinChannel = async () => {
    if (!client || !venueId || !userId) return;

    const screenClientUid = await client?.join(
      AGORA_APP_ID || "",
      AGORA_CHANNEL || "",
      AGORA_TOKEN || null
    );

    const experience = {
      screenClientUid: `${screenClientUid}`,
    };

    await updateTalkShowStudioExperience({ venueId, userId, experience });
  };

  const leaveChannel = useCallback(async () => {
    await stopShare();
    await client?.leave();
  }, [client, stopShare]);

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
    localScreenTrack,
    shareScreen,
    stopShare,
    joinChannel,
    leaveChannel,
  };
};
