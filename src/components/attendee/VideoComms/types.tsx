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
}

export interface VideoTrack extends Track {
  attach: (el: HTMLVideoElement) => void;
  kind: "video";
}

export interface AudioTrack extends Track {
  kind: "audio";
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

export interface LocalParticipant extends Participant {
  startAudio: () => void;
  stopAudio: () => void;
  stopVideo: () => void;
  startVideo: () => void;

  isTransmittingAudio: boolean;
  isTransmittingVideo: boolean;
}

export interface VideoCommsContextType {
  channelId?: string;
  status: VideoCommsStatus;
  joinChannel: JoinChannelFunc;
  disconnect: DisconnectFunc;

  localParticipant?: LocalParticipant;
  remoteParticipants: Participant[];
}

export interface HasNullableTrack {
  track: VideoTrack | null;
}

export interface StateUpdateCallbackParams {
  localParticipant?: LocalParticipant;
  remoteParticipants: Participant[];
  status: VideoCommsStatus;
}

export type StateUpdateCallback = (update: StateUpdateCallbackParams) => void;
