import { Point } from "types/utility";

import { RoomInfoType } from "../../../Structures/RoomsModel";

import { ConnectionWrapper } from "./PlayerIORoomOperator";

export interface IPlayerIORoomOperator {
  mainConnection: ConnectionWrapper;
  position: Point;

  update(listRooms: RoomInfoType[], hardUpdate?: boolean): void;
}
