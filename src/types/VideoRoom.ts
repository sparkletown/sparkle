export enum VideoChatRequestState {
  Invited = "Invited",
  Declined = "Declined",
  Accepted = "Accepted",
  Expired = "Expired",
}

export interface InvitedUser {
  id: string;
  location: string;
}

export interface VideoChatRequest {
  hostUserId: string;
  hostUserLocation: string;
  invitedUserIds: InvitedUser[];
  state: VideoChatRequestState;
  createdAt: number;
}
