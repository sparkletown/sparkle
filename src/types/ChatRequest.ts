export enum ChatRequestState {
  Asked = "Asked",
  Declined = "Declined",
  Accepted = "Accepted",
  Completed = "Completed",
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
};
