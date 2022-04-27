import { AnimateMapPoint } from "common/AnimateMapCommon";

import { RoomInfoType } from "../../../Structures/RoomsModel";

import { ConnectionWrapper } from "./PlayerIORoomOperator";

export interface IPlayerIORoomOperator {
  mainConnection: ConnectionWrapper;
  position: AnimateMapPoint;

  update(listRooms: RoomInfoType[], hardUpdate?: boolean): void;
}
