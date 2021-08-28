import { UInt, ULong } from "../../../../vendors/playerio/PlayerIO";
import { ProxyDatabaseObject } from "../../../../vendors/playerio/PromissesWrappers/ProxyDatabaseObject";

export const PLAYER_OBJECTS_TABLE = "PlayerObjects";

// export const SPEAKERS = "speakers"

export enum RoomTypes {
  Zone = "Z",
  SeparatedRoom = "S",
}

export enum MessagesTypes {
  // users messages
  move = "z",
  moveReserve = "x",
  // server messages
  processedMove = "a",
  processedMoveReserve = "b",
  divideSpeakers = "d",
  unitListeners = "u",
  roomInitResponse = "i",
  newUserJoined = "j",
  userLeft = "l",
}

export type MoveMessageTuple = [UInt, UInt];
export type MoveReserveMessageTuple = [UInt, UInt];

export type ProcessedMoveMessageTuple = [ULong, UInt, UInt];
export type ProcessedMoveReserveMessageTuple = [string, UInt, UInt];

export type RoomInitResponseMessageTuple = [string, number, UInt, string];
export type NewUserJoinedMessageTuple = [string, UInt, UInt];
export type UserLeftMessageTuple = [string];
export type FindMessageTuple<
  MessagesType
> = MessagesType extends MessagesTypes.move
  ? MoveMessageTuple
  : MessagesType extends MessagesTypes.moveReserve
  ? MoveReserveMessageTuple
  : MessagesType extends MessagesTypes.processedMove
  ? ProcessedMoveMessageTuple
  : MessagesType extends MessagesTypes.processedMoveReserve
  ? ProcessedMoveReserveMessageTuple
  : MessagesType extends MessagesTypes.roomInitResponse
  ? RoomInitResponseMessageTuple
  : MessagesType extends MessagesTypes.newUserJoined
  ? NewUserJoinedMessageTuple
  : MessagesType extends MessagesTypes.userLeft
  ? UserLeftMessageTuple
  : never;

export interface PlayerObject extends ProxyDatabaseObject {
  x?: number; // position by X
  y?: number; // position by Y
  i?: number; // inner id, get by convert user id string by getIntByHash() function
}
