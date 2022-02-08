import Twilio from "twilio-video";

export enum VideoCommsStatus {
  Disconnected = "DISCONNECTED",
  Connecting = "CONNECTING",
  Connected = "CONNECTED",
  Errored = "ERRORED",
}

export interface VideoCommsProviderProps {
  userId: string;
  children: React.ReactNode;
}

interface Track {
  kind: "video" | "audio";
  id: string;
  enabled: boolean;
}

export interface VideoTrack extends Track {
  attach: (el: HTMLVideoElement) => void;
  detach: () => void;
  kind: "video";
  twilioTrack: Twilio.VideoTrack;
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
   * Video tracks
   */
  videoTracks: VideoTrack[];

  /**
   * Audio tracks
   */
  audioTracks: AudioTrack[];
}

type JoinChannelFunc = (userId: string, channelId: string) => void;
type DisconnectFunc = () => void;
type ShareScreenFunc = () => void;

export interface LocalParticipant extends Participant {}

export interface VideoCommsContextType {
  channelId?: string;
  status: VideoCommsStatus;
  joinChannel: JoinChannelFunc;
  disconnect: DisconnectFunc;
  shareScreen: ShareScreenFunc;

  localParticipant?: LocalParticipant;
  remoteParticipants: Participant[];
  startAudio: () => void;
  stopAudio: () => void;
  stopVideo: () => void;
  startVideo: () => void;
  isTransmittingAudio: boolean;
  isTransmittingVideo: boolean;
}

export interface StateUpdateCallbackParams {
  localParticipant?: LocalParticipant;
  remoteParticipants: Participant[];
  status: VideoCommsStatus;
  isTransmittingAudio: boolean;
  isTransmittingVideo: boolean;
}

export type StateUpdateCallback = (update: StateUpdateCallbackParams) => void;
