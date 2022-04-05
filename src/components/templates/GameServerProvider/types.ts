import { UInt, ULong } from "../PlayerIO/PlayerIO";
import { ProxyDatabaseObject } from "../PlayerIO/PromissesWrappers/ProxyDatabaseObject";

export const PLAYER_OBJECTS_TABLE = "PlayerObjects";

// export const SPEAKERS = "speakers"

export enum RoomTypes {
  Zone = "Z",
  SeparatedRoom = "S",
}

export enum MessagesTypes {
  // server messages
  processedMove = "a",
  processedMoveReserve = "ar",
  divideSpeakers = "d",
  roomInitResponse = "i",
  newUserJoined = "j",
  userLeft = "l",
  processedShout = "s",
  processedShoutReserve = "sr",
  unitListeners = "u",
  // users messages
  shout = "y",
  shoutReserve = "yr",
  move = "z",
  moveReserve = "zr",
}

export type MoveMessageTuple = [UInt, UInt];
export type MoveReserveMessageTuple = [UInt, UInt];

export type ProcessedMoveMessageTuple = [ULong, UInt, UInt];
export type ProcessedMoveReserveMessageTuple = [string, UInt, UInt];

export type RoomInitResponseMessageTuple = [string, number, UInt, string];
export type NewUserJoinedMessageTuple = [string, UInt, UInt];
export type UserLeftMessageTuple = [string];

export type ShoutMessageTuple = [string];
export type ShoutMessageTupleReserve = [string];
export type ProcessedShoutMessageTuple = [ULong, string];
export type ProcessedShoutReserveMessageTuple = [string, string];

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
  : MessagesType extends MessagesTypes.shout
  ? ShoutMessageTuple
  : MessagesType extends MessagesTypes.shoutReserve
  ? ShoutMessageTuple
  : MessagesType extends MessagesTypes.processedShout
  ? ProcessedShoutMessageTuple
  : MessagesType extends MessagesTypes.processedShoutReserve
  ? ProcessedShoutReserveMessageTuple
  : never;

export interface PlayerObject extends ProxyDatabaseObject {
  x?: number; // position by X
  y?: number; // position by Y
  i?: number; // inner id, get by convert user id string by getIntByHash() function
}
