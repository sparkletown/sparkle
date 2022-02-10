import Twilio from "twilio-video";

export enum VideoCommsStatus {
  Disconnected = "DISCONNECTED",
  Connecting = "CONNECTING",
  Connected = "CONNECTED",
  Errored = "ERRORED",
}

interface Track {
  kind: "video" | "audio";
  id: string;
  enabled: boolean;
}

export enum VideoSource {
  Webcam = "WEBCAM",
  Screenshare = "SCREENSHARE",
}

export interface VideoTrack extends Track {
  attach: (el: HTMLVideoElement) => void;
  detach: () => void;
  kind: "video";
  twilioTrack: Twilio.VideoTrack;
  sourceType: VideoSource;
}

export interface AudioTrack extends Track {
  attach: (el: HTMLAudioElement) => void;
  detach: () => void;
  kind: "audio";
  twilioTrack: Twilio.AudioTrack;
}

export interface Participant {
  /**
   * ID of the participant - used for communication with the video platform
   */
  id: string;

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

type JoinChannel = (
  userId: string,
  channelId: string,
  enableVideo: boolean,
  enableAudio: boolean
) => void;
type Disconnect = () => void;
type ShareScreen = () => void;

export interface VideoCommsContextType {
  channelId?: string;
  status: VideoCommsStatus;
  joinChannel: JoinChannel;
  disconnect: Disconnect;
  shareScreen: ShareScreen;

  localParticipant?: Participant;
  remoteParticipants: Participant[];
  startAudio: () => void;
  stopAudio: () => void;
  stopVideo: () => void;
  startVideo: () => void;
  isTransmittingAudio: boolean;
  isTransmittingVideo: boolean;
}

export interface StateUpdateCallbackContext {
  localParticipant?: Participant;
  remoteParticipants: Participant[];
  status: VideoCommsStatus;
  isTransmittingAudio: boolean;
  isTransmittingVideo: boolean;
}

export type StateUpdateCallback = (update: StateUpdateCallbackContext) => void;
