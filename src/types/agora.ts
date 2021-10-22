import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

export enum AgoraClientConnectionState {
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  RECONNECTING = "RECONNECTING",
  DISCONNECTING = "DISCONNECTING",
}

export type UseAgoraRemotesReturn = IAgoraRTCRemoteUser[];

export interface UseAgoraScreenShareReturn {
  client?: IAgoraRTCClient;
  localScreenTrack?: ILocalVideoTrack;
  stopShare(): void;
  shareScreen(): Promise<void>;
  joinChannel(): Promise<void>;
  leaveChannel(): Promise<void>;
}

export interface UseAgoraCameraReturn {
  client?: IAgoraRTCClient;
  isCameraOn: boolean;
  isMicrophoneOn: boolean;
  localCameraTrack?: ILocalVideoTrack;
  toggleCamera(): void;
  toggleMicrophone(): void;
  joinChannel(): Promise<void>;
  leaveChannel(): Promise<void>;
}
