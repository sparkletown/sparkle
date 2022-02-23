import Twilio from "twilio-video";

import { Branded } from "utils/types";

export type TrackId = Branded<string, "TrackId">;
export type ChannelId = Branded<string, "ChannelId">;

export enum VideoCommsStatus {
  Disconnected = "DISCONNECTED",
  Connecting = "CONNECTING",
  Connected = "CONNECTED",
  Errored = "ERRORED",
}

export enum VideoSource {
  Webcam = "WEBCAM",
  Screenshare = "SCREENSHARE",
}

export type VideoTrack = {
  id: TrackId;
  attach: (el: HTMLVideoElement) => void;
  detach: () => void;
  kind: "video";
  twilioTrack: Twilio.VideoTrack;
  sourceType: VideoSource;
  enabled: boolean;
};

export type AudioTrack = {
  id: TrackId;
  attach: (el: HTMLAudioElement) => void;
  detach: () => void;
  kind: "audio";
  twilioTrack: Twilio.AudioTrack;
  enabled: boolean;
};

export type Track = VideoTrack | AudioTrack;

export interface Participant {
  /**
   * ID of the participant - used for communication with the video platform
   */
  twilioId: string;

  /**
   * ID of the participant from the point of view of Sparkle. e.g. userId
   */
  sparkleId: string;

  /**
   * Video tracks
   */
  videoTracks: VideoTrack[];

  /**
   * Audio tracks
   */
  audioTracks: AudioTrack[];
}

export interface JoinChannelOptions {
  userId: string;
  channelId: string;
  enableVideo: boolean;
  enableAudio: boolean;
}

type JoinChannel = (options: JoinChannelOptions) => void;
type Disconnect = () => void;
type ShareScreen = () => void;
type StopShareScreen = () => void;

export interface VideoCommsContextType {
  channelId?: ChannelId;
  status: VideoCommsStatus;
  joinChannel: JoinChannel;
  disconnect: Disconnect;
  shareScreen: ShareScreen;
  stopShareScreen: StopShareScreen;

  localParticipant?: Participant;
  remoteParticipants: Participant[];
  startAudio: () => void;
  stopAudio: () => void;
  stopVideo: () => void;
  startVideo: () => void;
  isTransmittingAudio: boolean;
  isTransmittingVideo: boolean;
}

export interface StateUpdateContext {
  localParticipant?: Participant;
  remoteParticipants: Participant[];
  status: VideoCommsStatus;
  isTransmittingAudio: boolean;
  isTransmittingVideo: boolean;
}

export type StateUpdateCallback = (update: StateUpdateContext) => void;
