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
  participant: LocalParticipant | RemoteParticipant;
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
  participant: LocalParticipant | RemoteParticipant,
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

  console.log(media, tracks);

  const trackSubscribedHandler = useCallback(
    (track: VideoTrack | AudioTrack) => {
      pushTrack(track);
    },
    [pushTrack]
  );

  const trackUnsubscribedHandler = useCallback(
    (track: VideoTrack | AudioTrack) => {
      filterTrack((t) => t !== track);
    },
    [filterTrack]
  );

  useEffect(() => {
    setTracks(
      media === "video"
        ? trackMapToVideoTracks(participant.videoTracks)
        : trackMapToAudioTracks(participant?.audioTracks)
    );

    /*
      Here twilio sometimes passes two params to "trackSubscribed" handler.
      If we use pushTrack here as a handler then objects of incorrect type
      can end up in tracks list.
     */
    participant.on("trackSubscribed", trackSubscribedHandler);
    participant.on("trackUnsubscribed", trackUnsubscribedHandler);

    return () => {
      participant.off("trackSubscribed", trackSubscribedHandler);
      participant.off("trackUnsubscribed", trackUnsubscribedHandler);

      clearTracks();
    };
  }, [
    clearTracks,
    filterTrack,
    media,
    participant,
    pushTrack,
    setTracks,
    trackSubscribedHandler,
    trackUnsubscribedHandler,
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

  // @debt should we be handling the other tracks too?
  const [firstTrack] = tracks;

  useEffect(() => {
    if (!firstTrack) return;

    ref.current ? firstTrack.attach(ref.current) : firstTrack.detach();

    firstTrack.on("enabled", enable);
    firstTrack.on("disabled", disable);

    return () => {
      firstTrack.off("enabled", enable);
      firstTrack.off("disabled", disable);

      firstTrack.detach();
    };
  }, [disable, enable, isEnabled, ref, firstTrack]);

  return { isEnabled, toggle };
};
