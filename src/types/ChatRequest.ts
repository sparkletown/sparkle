export enum ChatRequestState {
  Asked = "Asked",
  Declined = "Declined",
  Accepted = "Accepted",
  Completed = "Completed",
  Canceled = "Canceled",
}

export enum VideoChatRequestState {
  Asked = "Asked",
  Declined = "Declined",
  Accepted = "Accepted",
  Canceled = "Canceled",
}

export enum ChatRequestType {
  JoinTheirChat = "JoinTheirChat",
  JoinMyChat = "JoinMyChat",
}

export type ChatRequest = {
  fromUid: string;
  toUid: string;
  toJoinRoomOwnedByUid: string;
  type: ChatRequestType;
  state: ChatRequestState;
  createdAt: number;
  fromJoined: boolean;
  toJoined: boolean;
};

export interface VideoChatRequest {
  hostId: string;
  guestId: string;
  state: VideoChatRequestState;
  createdAt: number;
}
