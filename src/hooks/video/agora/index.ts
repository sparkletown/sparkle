import { useState, useEffect, useCallback } from "react";
import AgoraRTC, {
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

import { AGORA_APP_ID, AGORA_CHANNEL, AGORA_TOKEN } from "secrets";

import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { updateTalkShowStudioExperience } from "api/profile";

import { ReactHook } from "types/utility";
import {
  UseAgoraCameraProps,
  UseAgoraCameraReturn,
  UseAgoraRemotesProps,
  UseAgoraRemotesReturn,
  UseAgoraScreenShareProps,
  UseAgoraScreenShareReturn,
} from "types/agora";

export const useAgoraRemotes: ReactHook<
  UseAgoraRemotesProps,
  UseAgoraRemotesReturn
> = ({ client }) => {
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  const updateRemoteUsers = useCallback(() => {
    if (!client) return;

    setRemoteUsers(() => Array.from(client.remoteUsers));
  }, [client]);

  const handleUserPublished = useCallback(
    async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
      if (!client) return;

      await client.subscribe(user, mediaType);
      updateRemoteUsers();
    },
    [client, updateRemoteUsers]
  );

  useEffect(() => {
    if (!client) return;

    updateRemoteUsers();

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", updateRemoteUsers);
    client.on("user-joined", updateRemoteUsers);
    client.on("user-left", updateRemoteUsers);
    client.join(AGORA_APP_ID || "", AGORA_CHANNEL || "", AGORA_TOKEN || null);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", updateRemoteUsers);
      client.off("user-joined", updateRemoteUsers);
      client.off("user-left", updateRemoteUsers);
      client.leave();
    };
  }, [client, handleUserPublished, updateRemoteUsers]);

  return remoteUsers;
};

export const useAgoraScreenShare: ReactHook<
  UseAgoraScreenShareProps,
  UseAgoraScreenShareReturn
> = ({ client }) => {
  const { userId } = useUser();
  const venueId = useVenueId();

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

    updateTalkShowStudioExperience({ venueId, userId, experience });
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
};

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
