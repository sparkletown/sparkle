import {
  AudioTrack,
  DataTrack,
  LocalAudioTrack,
  LocalParticipant,
  LocalVideoTrack,
  Participant,
  RemoteParticipant,
  RemoteVideoTrack,
  Track,
  VideoTrack,
} from "twilio-video";

import { isTruthyFilter } from "./filter";

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

export const isLocalVideoTrack = (track: Track): track is LocalVideoTrack =>
  track.kind === "video" && (track as LocalVideoTrack).enable !== undefined;

export const isRemoteVideoTrack = (track: Track): track is RemoteVideoTrack =>
  track.kind === "video" && (track as RemoteVideoTrack).sid !== undefined;

export const isLocalAudioTrack = (track: Track): track is LocalAudioTrack =>
  track.kind === "audio" && (track as LocalAudioTrack).enable !== undefined;

export const isDataTrack = (track: Track): track is DataTrack =>
  track.kind === "data";

// export const getVideoTrackId = (track: VideoTrack) => {
//   if (isLocalVideoTrack(track)) {
//     return track.id;
//   } else if (isRemoteVideoTrack(track)) {
//     return track.sid;
//   }
// };

export const trackMapToVideoTracks = (
  trackMap: Participant["videoTracks"]
): VideoTrack[] =>
  Array.from(trackMap.values())
    .map((publication) => publication.track)
    .filter(isTruthyFilter);

export const trackMapToAudioTracks = (
  trackMap: Participant["audioTracks"]
): AudioTrack[] =>
  Array.from(trackMap.values())
    .map((publication) => publication.track)
    .filter(isTruthyFilter);

export const appendTrack = <T extends Track>(track: T) => (tracks: T[]) => [
  ...tracks,
  track,
];

export const filterTrack = <T extends Track>(track: T) => (tracks: T[]) =>
  tracks.filter((t) => t !== track);
