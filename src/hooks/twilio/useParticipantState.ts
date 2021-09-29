import { useEffect, useState } from "react";
import {
  AudioTrack,
  LocalParticipant,
  RemoteParticipant,
  Track,
  VideoTrack,
} from "twilio-video";

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

import { useShowHide } from "hooks/useShowHide";

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
    isShown: isAudioOn,

    setShown: setMuted,
    toggle: toggleMuted,
    show: unmuteAudio,
    hide: muteAudio,
  } = useShowHide(!defaultMute);

  const isMuted = !isAudioOn;

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
    muteAudio,
    unmuteAudio,
    toggleMuted,

    isVideoHidden,
    hideVideo,
    showVideo,
    toggleVideo,
  };
};
