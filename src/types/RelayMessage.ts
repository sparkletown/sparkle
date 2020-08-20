export type UserState = {
  x: number;
  y: number;
  speaking: boolean;
  reserved?: string;
};

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
