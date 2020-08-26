export type UserState = {
  x: number;
  y: number;
  speaking?: boolean;
  state?: { [key: string]: string };
};

export enum UserStateKey {
  Bike = "bike",
  VideoChatBlocked = "videoChatBlocked",
}

export const stateBoolean: (state: UserState, key: UserStateKey) => boolean = (
  state,
  key
) => state?.state?.[key] === true.toString();

export type UserStateMap = { [uid: string]: UserState };

export enum MessageType {
  Hello = "hello",
  Update = "update",
  Broadcast = "broadcast",
}

export type HelloWsMessage = {
  type: MessageType.Hello;
  uid: string;
};

export type UpdateWsMessage = {
  type: MessageType.Update;
  uid: string;
  update: UserState;
};

export type BroadcastMessage = {
  type: MessageType.Broadcast;
  updates: UserStateMap;
};
