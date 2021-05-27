export enum VideoChatRequestState {
  Invited = "Invited",
  Declined = "Declined",
  Accepted = "Accepted",
  Expired = "Expired",
}

export interface VideoChatRequest {
  hostUserId: string;
  invitedUserIds: string[];
  state: VideoChatRequestState;
  createdAt: number;
}
