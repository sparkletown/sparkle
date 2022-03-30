import { Point } from "types/utility";

import { RoomInfoType } from "../../GameStructures";

import { ConnectionWrapper } from "./PlayerIORoomOperator";

export interface IPlayerIORoomOperator {
  mainConnection: ConnectionWrapper;
  position: Point;

  update(listRooms: RoomInfoType[], hardUpdate?: boolean): void;
}
