export enum RelayMessageType {
  Hello = "hello",
  Update = "update",
}

export type RelayMessage = {
  messageType: RelayMessageType;
  x?: number;
  y?: number;
  uid?: string;
};
