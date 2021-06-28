import { IAgoraRTCClient, ILocalVideoTrack } from "agora-rtc-sdk-ng";

export enum AgoraClientConnectionState {
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  RECONNECTING = "RECONNECTING",
  DISCONNECTING = "DISCONNECTING",
}

export interface UseAgoraScreenShareProps {
  client?: IAgoraRTCClient;
}
export interface UseAgoraScreenShareReturn {
  localScreenTrack?: ILocalVideoTrack;
  stopShare(): void;
  shareScreen(): Promise<void>;
  joinChannel(): Promise<void>;
  leaveChannel(): Promise<void>;
}
