import { RefObject, useCallback, useEffect } from "react";
import { useList } from "react-use";
import {
  AudioTrack,
  LocalParticipant,
  RemoteParticipant,
  VideoTrack,
} from "twilio-video";

import {
  isLocalTrack,
  trackMapToAudioTracks,
  trackMapToVideoTracks,
} from "utils/twilio";

import { useShowHide } from "hooks/useShowHide";

export interface UseParticipantStateProps {
  videoRef: RefObject<HTMLVideoElement>;
  audioRef: RefObject<HTMLAudioElement>;
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
export const useParticipantMediaState = (
  media: "audio" | "video",
  ref: RefObject<HTMLVideoElement | HTMLAudioElement>,
  participant: LocalParticipant | RemoteParticipant | undefined,
  defaultMute: boolean
) => {
  const [
    tracks,
    {
      set: setTracks,
      push: pushTrack,
      filter: filterTrack,
      clear: clearTracks,
    },
  ] = useList<VideoTrack | AudioTrack>();

  const trackUnsubscribed = useCallback(
    (track: VideoTrack | AudioTrack) => {
      filterTrack((t) => t !== track);
    },
    [filterTrack]
  );

  useEffect(() => {
    if (!participant) return;

    setTracks(
      media === "video"
        ? trackMapToVideoTracks(participant.videoTracks)
        : trackMapToAudioTracks(participant?.audioTracks)
    );

    participant.on("trackSubscribed", pushTrack);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      participant.off("trackSubscribed", pushTrack);
      participant.off("trackUnsubscribed", trackUnsubscribed);

      clearTracks();
    };
  }, [
    clearTracks,
    filterTrack,
    media,
    participant,
    pushTrack,
    setTracks,
    trackUnsubscribed,
  ]);

  const {
    isShown: isEnabled,

    toggle,
    show: enable,
    hide: disable,
  } = useShowHide(!defaultMute);

  useEffect(() => {
    if (isEnabled) {
      tracks.filter(isLocalTrack).forEach((localTrack) => localTrack.enable());
    } else {
      tracks.filter(isLocalTrack).forEach((localTrack) => localTrack.disable());
    }
  }, [isEnabled, tracks]);

  // @debt should we be handling the other audio tracks?
  const track = tracks[0];
  useEffect(() => {
    if (!track) return;

    ref.current ? track.attach(ref.current) : track.detach();

    track.on("enabled", enable);
    track.on("disabled", disable);

    return () => {
      track.off("enabled", enable);
      track.off("disabled", disable);

      track.detach();
    };
  }, [disable, enable, ref, track]);

  return { isEnabled, toggle };
};
