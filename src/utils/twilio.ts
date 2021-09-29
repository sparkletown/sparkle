import {
  AudioTrack,
  LocalAudioTrack,
  LocalParticipant,
  LocalVideoTrack,
  Participant,
  RemoteParticipant,
  Track,
  VideoTrack,
} from "twilio-video";

import { isTruthy } from "utils/types";

export const isLocalParticipant = (
  participant: LocalParticipant | RemoteParticipant
): participant is LocalParticipant =>
  (participant as LocalParticipant).publishTrack !== undefined;

export const isRemoteParticipant = (
  participant: LocalParticipant | RemoteParticipant
): participant is RemoteParticipant => !isLocalParticipant(participant);

export const isAudioTrack = (track: Track): track is AudioTrack =>
  track.kind === "audio";

export const isVideoTrack = (track: Track): track is VideoTrack =>
  track.kind === "video";

export const isLocalTrack = (
  track: Track
): track is LocalAudioTrack | LocalVideoTrack => {
  return isAudioTrack(track)
    ? (track as LocalAudioTrack).enable !== undefined
    : isVideoTrack(track)
    ? (track as LocalVideoTrack).enable !== undefined
    : false;
};

export const trackMapToVideoTracks = (
  trackMap: Participant["videoTracks"]
): VideoTrack[] =>
  Array.from(trackMap.values())
    .map((publication) => publication.track)
    .filter(isTruthy);

export const trackMapToAudioTracks = (
  trackMap: Participant["audioTracks"]
): AudioTrack[] =>
  Array.from(trackMap.values())
    .map((publication) => publication.track)
    .filter(isTruthy);
