import { useCallback, useEffect, useState } from "react";
import {
  AudioTrack,
  connect,
  LocalParticipant,
  LocalVideoTrack,
  RemoteParticipant,
  Room,
  Track,
  VideoTrack,
} from "twilio-video";

import { getVideoToken } from "api/video";

import {
  appendTrack,
  filterTrack,
  isAudioTrack,
  isLocalAudioTrack,
  isLocalVideoTrack,
  isVideoTrack,
  trackMapToAudioTracks,
  trackMapToVideoTracks,
} from "utils/twilio";

import { useShowHide } from "./useShowHide";

export interface UseParticipantStateProps {
  participant?: LocalParticipant | RemoteParticipant;
  defaultMute: boolean;
  defaultVideoHidden: boolean;
}

/**
 * Manage the state of the audio/video tracks (including mute, hiding video, etc) for
 * the provided Twilio Participant.
 *
 * @param participant
 * @param defaultMute
 * @param defaultVideoHidden
 *
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/Participant.html
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/LocalParticipant.html
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/RemoteParticipant.html
 *
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/LocalVideoTrack.html
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/RemoteVideoTrack.html
 *
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/LocalAudioTrack.html
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/RemoteAudioTrack.html
 */
export const useParticipantState = ({
  participant,
  defaultMute,
  defaultVideoHidden,
}: UseParticipantStateProps) => {
  // Audio / Video tracks
  const [videoTracks, setVideoTracks] = useState<VideoTrack[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);

  useEffect(() => {
    if (!participant) return;

    setVideoTracks(trackMapToVideoTracks(participant.videoTracks));
    setAudioTracks(trackMapToAudioTracks(participant.audioTracks));

    const trackSubscribed = (track: Track) => {
      if (isVideoTrack(track)) {
        setVideoTracks(appendTrack(track));
      } else if (isAudioTrack(track)) {
        setAudioTracks(appendTrack(track));
      }
    };

    const trackUnsubscribed = (track: Track) => {
      if (isVideoTrack(track)) {
        setVideoTracks(filterTrack(track));
      } else if (isAudioTrack(track)) {
        setAudioTracks(filterTrack(track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      participant.off("trackSubscribed", trackSubscribed);
      participant.off("trackUnsubscribed", trackUnsubscribed);

      setVideoTracks([]);
      setAudioTracks([]);
    };
  }, [participant]);

  // Mute/unmute audio
  const {
    isShown: isMuted,

    setShown: setMuted,
    toggle: toggleMuted,
  } = useShowHide(defaultMute);

  useEffect(() => {
    if (isMuted) {
      // Mute all of our localAudioTracks
      audioTracks
        .filter(isLocalAudioTrack)
        .forEach((localAudioTrack) => localAudioTrack.disable());
    } else {
      // Unmute all of our localAudioTracks
      audioTracks
        .filter(isLocalAudioTrack)
        .forEach((localAudioTrack) => localAudioTrack.enable());
    }
  }, [audioTracks, isMuted]);

  // Show/hide video
  const {
    isShown: isVideoShown,

    show: showVideo,
    hide: hideVideo,
    toggle: toggleVideo,
  } = useShowHide(!defaultVideoHidden);

  const isVideoHidden = !isVideoShown;

  useEffect(() => {
    if (isVideoHidden) {
      // Pause all of our localVideoTracks
      videoTracks
        .filter(isLocalVideoTrack)
        .forEach((localVideoTrack) => localVideoTrack.disable());
    } else {
      // Unpause all of our localVideoTracks
      videoTracks
        .filter(isLocalVideoTrack)
        .forEach((localVideoTrack) => localVideoTrack.enable());
    }
  }, [videoTracks, isVideoHidden]);

  return {
    videoTracks,
    audioTracks,

    isMuted,
    setMuted,
    toggleMuted,

    isVideoHidden,
    hideVideo,
    showVideo,
    toggleVideo,
  };
};

export interface UseVideoRoomStateProps {
  userId?: string;
  roomName?: string;
  showVideoByDefault?: boolean;
}

export const useVideoRoomState = ({
  userId,
  roomName,
  showVideoByDefault = true,
}: UseVideoRoomStateProps) => {
  const [token, setToken] = useState<string>();

  useEffect(() => {
    if (!userId || !!token || !roomName) return;

    getVideoToken({
      userId,
      roomName,
    }).then((token) => {
      if (!token) return;

      setToken(token);
    });
  }, [userId, roomName, token]);

  const [room, setRoom] = useState<Room>();
  const [participants, setParticipants] = useState<
    (LocalParticipant | RemoteParticipant)[]
  >([]);

  const disconnect = useCallback(() => {
    setRoom((currentRoom) => {
      if (currentRoom?.localParticipant?.state !== "connected")
        return currentRoom;

      currentRoom.localParticipant.tracks.forEach((trackPublication) => {
        (trackPublication.track as LocalVideoTrack).stop();
      });

      currentRoom.disconnect();

      return undefined;
    });
  }, []);

  const {
    isShown: hasVideo,

    show: turnVideoOn,
    hide: turnVideoOff,
  } = useShowHide(showVideoByDefault);

  const participantConnected = useCallback((participant: RemoteParticipant) => {
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  }, []);

  const participantDisconnected = useCallback(
    (participant: RemoteParticipant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    },
    []
  );

  useEffect(() => {
    if (!token || !roomName) return;

    // https://media.twiliocdn.com/sdk/js/video/releases/2.7.1/docs/global.html#ConnectOptions
    connect(token, {
      name: roomName,
      video: hasVideo,
      enableDscp: true,
    }).then(setRoom);

    return () => {
      disconnect();
    };
  }, [disconnect, roomName, token, hasVideo]);

  useEffect(() => {
    if (!room) return;

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);

    const remoteParticipants = Array.from(room.participants.values());
    setParticipants(
      room.localParticipant
        ? [room.localParticipant, ...remoteParticipants]
        : remoteParticipants
    );

    // Do we need `.off`? It looks like it's not in the docs
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room, participantConnected, participantDisconnected]);

  return {
    token,

    room,
    participants,

    disconnect,
    turnVideoOff,
    turnVideoOn,
  };
};
