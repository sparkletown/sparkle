export enum ChatRequestState {
  Asked = "Asked",
  Declined = "Declined",
  Accepted = "Accepted",
  Completed = "Completed",
  Canceled = "Canceled",
}

export enum ChatRequestType {
  JoinTheirChat = "JoinTheirChat",
  JoinMyChat = "JoinMyChat",
}

export type ChatRequest = {
  id?: string;
  fromUid: string;
  toUid: string;
  toJoinRoomOwnedByUid: string;
  type: ChatRequestType;
  state: ChatRequestState;
  createdAt: number;
  fromJoined: boolean;
  toJoined: boolean;
};
