import { useEffect } from "react";
import { useList } from "react-use";
import {
  AudioTrack,
  LocalParticipant,
  RemoteParticipant,
  Track,
  VideoTrack,
} from "twilio-video";

import {
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
  const [
    videoTracks,
    {
      set: setVideoTracks,
      push: pushVideoTrack,
      filter: filterVideoTrack,
      clear: clearVideoTracks,
    },
  ] = useList<VideoTrack>();
  const [
    audioTracks,
    {
      set: setAudioTracks,
      push: pushAudioTrack,
      filter: filterAudioTrack,
      clear: clearAudioTracks,
    },
  ] = useList<AudioTrack>();

  useEffect(() => {
    if (!participant) return;

    setVideoTracks(trackMapToVideoTracks(participant.videoTracks));
    setAudioTracks(trackMapToAudioTracks(participant.audioTracks));

    const trackSubscribed = (track: Track) => {
      if (isVideoTrack(track)) {
        pushVideoTrack(track);
      } else if (isAudioTrack(track)) {
        pushAudioTrack(track);
      }
    };

    const trackUnsubscribed = (track: Track) => {
      if (isVideoTrack(track)) {
        filterVideoTrack((t) => t !== track);
      } else if (isAudioTrack(track)) {
        filterAudioTrack((t) => t !== track);
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      participant.off("trackSubscribed", trackSubscribed);
      participant.off("trackUnsubscribed", trackUnsubscribed);

      clearVideoTracks();
      clearAudioTracks();
    };
  }, [
    clearAudioTracks,
    clearVideoTracks,
    filterAudioTrack,
    filterVideoTrack,
    participant,
    pushAudioTrack,
    pushVideoTrack,
    setAudioTracks,
    setVideoTracks,
  ]);

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

  useEffect(() => {
    if (!isVideoShown) {
      videoTracks
        .filter(isLocalVideoTrack)
        .forEach((localVideoTrack) => localVideoTrack.disable());
    } else {
      videoTracks
        .filter(isLocalVideoTrack)
        .forEach((localVideoTrack) => localVideoTrack.enable());
    }
  }, [videoTracks, isVideoShown]);

  return {
    videoTracks,
    audioTracks,

    isMuted,
    setMuted,
    muteAudio,
    unmuteAudio,
    toggleMuted,

    isVideoShown,
    hideVideo,
    showVideo,
    toggleVideo,
  };
};
