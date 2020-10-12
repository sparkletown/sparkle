export type UserState = {
  x: number;
  y: number;
  speaking?: boolean;
  state?: { [key: string]: string };
};

export enum UserStateKey {
  Bike = "Bike", // boolean
  Video = "Video", // enum UserVideoState
}

export const stateBoolean: (
  state: UserState | undefined,
  key: UserStateKey
) => boolean | undefined = (state, key) => {
  switch (state?.state?.[key]) {
    case true.toString():
      return true;
    case false.toString():
      return false;
  }
};

export type UserStateMap = { [uid: string]: UserState };

export enum UserVideoState {
  Locked = "locked",
  Open = "open",
}

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
